import { Colors } from '../helper/Colors';
import { Options } from '../types';

export namespace Default {
  export const LogLevels = {
    info: Colors.GREEN,
    warn: Colors.YELLOW,
    error: Colors.RED,
    debug: Colors.BRIGHT_BLUE,
  };

  export const ConfigFiles = {
    maxSize: 1024 * 1024,
    bufferSize: 1024,
    autoFlushInterval: 1000,
    logFilePath: 'logs/app.log',
    maxFiles: 5,
    colors: LogLevels,
  };
  export const DefaultOptions: Options = {
    format: 'iso', // Default timestamp format
    transports: ['console'], // Console transport by default
    console: {
      colors: {
        info: '\x1b[32m', // Green
        warn: '\x1b[33m', // Yellow
        error: '\x1b[31m', // Red
        debug: '\x1b[34m', // Blue
      },
    },
    file: undefined, // No file transport by default
    rotation: {
      maxSize: 1024 * 1024, // 1 MB file size for rotation
    },
  };
}
