export type LogLevel = "info" | "warn" | "error" | "debug";
export interface Options {
  level?: LogLevel;
  file?: string;
  jsonFormat?: boolean;
  timestampFormat?: "iso" | "locale";
  rotation?: {
    maxSize: number;
  };
  errorHandling?: {
    file: string;
    console: boolean;
  };
  transports?: Array<"console" | "file">;
}
export interface LogOptions {
  message?: string;
  error?: Error;
  category?: string;
}
