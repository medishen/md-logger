import * as fs from "fs";
import * as path from "path";
import { LogLevel } from "../types";

export class FileTransport {
  private fileStream: fs.WriteStream;
  private logFilePath: string;
  private maxSize: number;
  private maxFiles: number;
  private currentSize: number;
  private rotating: boolean;

  constructor(
    logFilePath: string,
    opts: { maxSize?: number; maxFiles?: number } = {}
  ) {
    this.logFilePath = logFilePath;
    this.maxSize = opts.maxSize || 1024 * 1024; // 1 MB default max size
    this.maxFiles = opts.maxFiles || 5; // Default to keeping 5 rotated files
    this.currentSize = 0;
    this.rotating = false;

    // Ensure the directory exists
    const logDir = path.dirname(this.logFilePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Track the current file size
    if (fs.existsSync(this.logFilePath)) {
      this.currentSize = fs.statSync(this.logFilePath).size;
    }

    // Create or open the log file in append mode
    this.fileStream = fs.createWriteStream(this.logFilePath, { flags: "a" });
  }

  private async rotateFiles(): Promise<void> {
    if (this.rotating) return Promise.resolve(); // Prevent multiple rotations at once
    this.rotating = true;

    return new Promise<void>((resolve, reject) => {
      // End the current file stream
      this.fileStream.end(() => {
        // Rotate the files, starting from the last backup
        for (let i = this.maxFiles - 1; i > 0; i--) {
          const oldFile = `${this.logFilePath}.${i - 1}`;
          const newFile = `${this.logFilePath}.${i}`;
          if (fs.existsSync(oldFile)) {
            try {
              fs.renameSync(oldFile, newFile);
            } catch (error) {
              this.rotating = false;
              return reject(error);
            }
          }
        }

        // Rename the current log file
        const rotatedFilePath = `${this.logFilePath}.0`;
        if (fs.existsSync(this.logFilePath)) {
          try {
            fs.renameSync(this.logFilePath, rotatedFilePath);
          } catch (error) {
            this.rotating = false;
            return reject(error);
          }
        }

        // Create a new file stream for logging
        this.fileStream = fs.createWriteStream(this.logFilePath, {
          flags: "a",
        });
        this.currentSize = 0;
        this.rotating = false;
        resolve();
      });
    });
  }

  async log(message: string, level: LogLevel,category?: string): Promise<{ rotatedFiles: string[] }> {
    const formattedMessage = category
      ? `${category.toUpperCase()}:\n${message}\n`
      : `${message}\n`;
    const messageSize = Buffer.byteLength(formattedMessage, "utf8");

    // Check if rotation is needed
    const needsRotation = this.currentSize + messageSize > this.maxSize;

    if (needsRotation) {
      const currentFileSize = fs.existsSync(this.logFilePath)
        ? fs.statSync(this.logFilePath).size
        : 0;

      if (currentFileSize > this.maxSize) {
        await this.rotateFiles();
      }
    }
    return new Promise<{ rotatedFiles: string[] }>((resolve, reject) => {
      // Ensure that the file stream is not ended before writing
      this.fileStream.write(formattedMessage, (err) => {
        if (err) return reject(err);
        this.currentSize += messageSize;
        this.fileStream.end(() => {
          resolve({ rotatedFiles: this.getRotatedFiles() });
        });
      });
    });
  }
  private getRotatedFiles(): string[] {
    const rotatedFiles: string[] = [];
    for (let i = 0; i < this.maxFiles; i++) {
      const filePath = `${this.logFilePath}.${i}`;
      if (fs.existsSync(filePath)) {
        rotatedFiles.push(filePath);
      }
    }
    return rotatedFiles;
  }

  close(): void {
    this.fileStream.end();
  }
}
