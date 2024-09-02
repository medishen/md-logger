import { Format, logLevels } from "../helper";
import { Cache, CacheOptions, LogEntry } from "../helper/Cache";
import { ConsoleTransport } from "../transports/Console";
import { FileTransport } from "../transports/File";
import { LogLevel, Options } from "../types";

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

  private async log(
    message: string,
    level: LogLevel,
    category?: string
  ): Promise<void> {
    if (this.shouldLog(level)) {
      const formattedMessage = Format.Message(
        message,
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

  public async info(message: string, category?: string): Promise<void> {
    await this.log(message, "info", category);
  }

  public async warn(message: string, category?: string): Promise<void> {
    await this.log(message, "warn", category);
  }

  public async error(
    message: string,
    error?: Error,
    category?: string
  ): Promise<void> {
    const errorMessage = error ? `${message} ${error.message}` : message;
    await this.log(errorMessage, "error", category);
  }

  public async debug(message: string, category?: string): Promise<void> {
    await this.log(message, "debug", category);
  }

  public shutdown(): void {
    if (this.cache) {
      this.cache.shutdown();
    }
  }
}
