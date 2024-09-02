import { LogLevel } from "../types";

export interface CacheOptions {
  maxSize: number;
  flushInterval: number;
}

export interface LogEntry {
  message: string;
  level: LogLevel;
  category?: string;
}

export class Cache {
  private cache: LogEntry[] = [];
  private maxSize: number;
  private flushInterval: number;
  private flushCallback: (entries: LogEntry[]) => void;
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(
    options: CacheOptions,
    flushCallback: (entries: LogEntry[]) => void
  ) {
    this.maxSize = options.maxSize;
    this.flushInterval = options.flushInterval;
    this.flushCallback = flushCallback;
    this.startFlushTimer();
  }

  public addEntry(entry: LogEntry): void {
    this.cache.push(entry);

    if (this.cache.length >= this.maxSize) {
      this.flush();
    }
  }

  public flush(): void {
    if (this.cache.length > 0) {
      this.flushCallback(this.cache);
      this.cache = [];
    }
  }

  private startFlushTimer(): void {
    if (this.flushInterval > 0) {
      this.flushTimer = setInterval(() => this.flush(), this.flushInterval);
    }
  }

  public stopFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  public shutdown(): void {
    this.stopFlushTimer();
    this.flush();
  }
}