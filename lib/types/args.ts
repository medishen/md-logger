import { LogLevel, Options } from ".";

export namespace Arguments {
  export interface FileTransport {
    logFilePath: string;
    opts?: {
      maxSize?: number;
      bufferSize?: number;
      autoFlushInterval?: number;
    };
  }
  export interface ConsoleTransport {
    colors: Record<LogLevel, string>;
  }
  export interface Format {
    message: string;
    level?: LogLevel;
    category?: string;
    format: "iso" | "locale";
  }
  export interface Log {
    message: string;
    level?: LogLevel;
    category?: string;
  }
}
