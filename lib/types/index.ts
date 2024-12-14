export type LogLevel = 'info' | 'warn' | 'error' | 'debug';
export interface Options {
  file?: string;
  format?: 'iso' | 'locale';
  rotation?: {
    maxSize: number;
  };
  transports?: Array<'console' | 'file'>;
  console?: {
    colors?: {
      [key in LogLevel]: string;
    };
  };
}
export interface LogOptions {
  message?: string;
  error?: Error;
  category?: string;
}
