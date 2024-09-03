import { Format, logLevels } from "../helper";
import { Cache, CacheOptions, LogEntry } from "../helper/Cache";
import { ConsoleTransport } from "../transports/Console";
import { FileTransport } from "../transports/File";
import { LogLevel, LogOptions, Options } from "../types";

export class Logger {
  private level: LogLevel;
  private timestampFormat: "iso" | "locale";
  private consoleTransport?: ConsoleTransport;
  private fileTransport?: FileTransport;
  private cache?: Cache;

  constructor(
    options: Options,
    consoleTransport?: ConsoleTransport,
    fileTransport?: FileTransport,
    cacheOptions?: CacheOptions
  ) {
    this.level = options.level!;
    this.timestampFormat = options.timestampFormat!;
    this.consoleTransport = consoleTransport;
    this.fileTransport = fileTransport;

    if (cacheOptions) {
      this.cache = new Cache(cacheOptions, this.flush.bind(this));
    }
  }
  private shouldLog(level: LogLevel): boolean {
    return logLevels[level] <= logLevels[this.level];
  }

  private flush(entries: LogEntry[]): void {
    entries.forEach(({ message, level, category }) => {
      if (this.consoleTransport) {
        this.consoleTransport.log(message, level, category);
      }
      if (this.fileTransport) {
        this.fileTransport.log(message, level, category);
      }
    });
  }

  private async log(level: LogLevel, options: LogOptions): Promise<void> {
    const { message, error, category } = options;

    // If the message is not provided and an error is present, use the error message
    const finalMessage =
      message || (error ? error.message : "No message provided");

    if (this.shouldLog(level)) {
      const formattedMessage = Format.Message(
        finalMessage,
        level,
        category,
        this.timestampFormat
      );
      const logEntry: LogEntry = { message: formattedMessage, level, category };

      if (this.cache) {
        this.cache.addEntry(logEntry);
      } else {
        this.flush([logEntry]);
      }
    }
  }

  public async info(options: string | LogOptions): Promise<void> {
    if (typeof options === "string") {
      await this.log("info", { message: options });
    } else {
      await this.log("info", options);
    }
  }

  public async warn(options: string | LogOptions): Promise<void> {
    if (typeof options === "string") {
      await this.log("warn", { message: options });
    } else {
      await this.log("warn", options);
    }
  }

  public async error(options: string | LogOptions): Promise<void> {
    if (typeof options === "string") {
      await this.log("error", { message: options });
    } else {
      // Combine error message with existing message if provided
      const message =
        options.message ||
        (options.error ? options.error.message : "An error occurred");
      await this.log("error", {
        message,
        error: options.error,
        category: options.category,
      });
    }
  }

  public async debug(options: string | LogOptions): Promise<void> {
    if (typeof options === "string") {
      await this.log("debug", { message: options });
    } else {
      await this.log("debug", options);
    }
  }

  public shutdown(): void {
    if (this.cache) {
      this.cache.shutdown();
    }
  }
}
