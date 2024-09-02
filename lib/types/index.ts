export type LogLevel = "info" | "warn" | "error" | "debug";
export interface Options {
  level?: LogLevel;
  file?: string;
  jsonFormat?: boolean;
  timestampFormat?: "iso" | "locale";
  rotation?: {
    enabled: boolean;
    maxSize: number; // Maximum file size in bytes
    maxFiles: number; // Maximum number of backup files
  };
  errorHandling?: {
    file: string;
    console: boolean;
  };
  transports?: Array<"console" | "file">;
}
