import * as fs from "fs";
import * as path from "path";
import { LogLevel } from "../types";

export class FileTransport {
  private fileStream: fs.WriteStream;
  private logFilePath: string;
  private maxSize: number;
  private currentSize: number;
  private rotating: boolean;
  private fileIndex: number;
  private logBuffer: string[];
  private bufferSize: number;
  private autoFlushInterval: number;
  private flushTimeout: NodeJS.Timeout | null;

  constructor(
    logFilePath: string,
    opts: {
      maxSize?: number;
      bufferSize?: number;
      autoFlushInterval?: number;
    } = {}
  ) {
    this.logFilePath = logFilePath;
    this.maxSize = opts.maxSize || 1024 * 1024; // 1 MB default max size
    this.currentSize = 0;
    this.rotating = false;
    this.fileIndex = 0;
    this.logBuffer = [];
    this.bufferSize = opts.bufferSize || 1024; // Buffer size in bytes
    this.autoFlushInterval = opts.autoFlushInterval || 1000; // Auto-flush every
    this.flushTimeout = null;
    // Ensure the directory exists
    const logDir = path.dirname(this.logFilePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Track the current file size
    fs.promises
      .stat(this.logFilePath)
      .then((stat) => (this.currentSize = stat.size))
      .catch(() => (this.currentSize = 0)); // Default to 0 if file doesn't exist

    // Create or open the log file in append mode
    this.fileStream = fs.createWriteStream(this.logFilePath, { flags: "a" });

    // Start auto-flush timer
    this.startAutoFlush();
    
    // Register process exit handler to flush and close automatically
    this.ExitHandler();
  }

  // Rotates the files when the current log file exceeds the max size
  private async rotateFiles(): Promise<void> {
    if (this.rotating) return; // Prevent multiple rotations
    this.rotating = true;

    this.fileStream.end(); // End the current file stream
    const rotatedFilePath = `${this.logFilePath}.${this.fileIndex++}`;

    // Rename the current log file
    try {
      await fs.promises.rename(this.logFilePath, rotatedFilePath);
    } catch (error) {
      this.rotating = false;
      throw error;
    }

    // Open a new file stream
    this.fileStream = fs.createWriteStream(this.logFilePath, { flags: "a" });
    this.currentSize = 0;
    this.rotating = false;
  }

  // Logs a message with buffering and file rotation
  async log(
    message: string,
    level: LogLevel,
    category?: string
  ): Promise<void> {
    const formattedMessage = category
      ? `${category.toUpperCase()}:\n${message}\n`
      : `${message}\n`;

    const messageSize = Buffer.byteLength(formattedMessage, "utf8");

    // Add the log message to the buffer
    this.logBuffer.push(formattedMessage);

    // Check if the buffer size exceeds the threshold or if the log file needs rotation
    if (this.shouldFlush(messageSize)) {
      await this.flush();
    }
  }

  // Checks if the buffer should be flushed or file rotation is needed
  private shouldFlush(messageSize: number): boolean {
    // Check if buffer size exceeds the threshold or file size exceeds maxSize
    const bufferSize = Buffer.byteLength(this.logBuffer.join(""), "utf8");
    return (
      bufferSize >= this.bufferSize ||
      this.currentSize + messageSize > this.maxSize
    );
  }

  // Flushes the buffer to the log file and handles file rotation if needed
  private async flush(): Promise<void> {
    const bufferContent = this.logBuffer.join("");
    const bufferSize = Buffer.byteLength(bufferContent, "utf8");

    if (bufferSize === 0) return; // No data to flush

    // Write the buffered content to the file
    await new Promise<void>((resolve, reject) => {
      this.fileStream.write(bufferContent, (err) => {
        if (err) {
          console.error("Write error:", err);
          return reject(err);
        }
        this.currentSize += bufferSize;
        this.logBuffer = []; // Clear the buffer
        resolve();
      });
    });

    // Check if rotation is needed
    if (this.currentSize >= this.maxSize) {
      await this.rotateFiles();
    }
  }

  // Starts the auto-flush timer to flush the buffer periodically
  private startAutoFlush(): void {
    this.flushTimeout = setInterval(() => {
      this.flush().catch((err) => console.error("Auto-flush error:", err));
    }, this.autoFlushInterval);
  }

  // Stops the auto-flush timer
  private stopAutoFlush(): void {
    if (this.flushTimeout) {
      clearInterval(this.flushTimeout);
      this.flushTimeout = null;
    }
  }
  // Register a handler to automatically close on process exit
  private ExitHandler(): void {
    process.on("exit", async () => {
      await this.close(); // Ensure the logs are flushed and file is closed
    });

    process.on("SIGINT", async () => {
      await this.close();
      process.exit(); // Handle Ctrl+C
    });

    process.on("SIGTERM", async () => {
      await this.close();
      process.exit();
    });
  }

  // Closes the file stream and flushes remaining logs
  async close(): Promise<void> {
    this.stopAutoFlush();
    await this.flush(); // Flush remaining logs
    this.fileStream.end(); // Close the file stream
  }
}
