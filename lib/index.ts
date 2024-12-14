import { Default } from './default';
import { Log } from './helper/Format';
import { ConsoleTransport } from './transports/Console';
import { FileTransport } from './transports/File';
import { Options } from './types';
import { Arguments } from './types/args';
export class Logger {
  private fileTransport?: FileTransport;
  private consoleTransport?: ConsoleTransport;
  private options: Options;

  constructor(options?: Options) {
    this.options = { ...Default.DefaultOptions, ...options };

    // Initialize Console Transport
    if (this.options?.transports?.includes('console')) {
      if (this.options.console) {
        this.consoleTransport = new ConsoleTransport({ colors: this.options.console.colors! }, new Log(this.options.format ?? 'iso'));
      }
    }

    // Initialize File Transport
    if (this.options?.transports?.includes('file') && this.options.file) {
      const fileTransportArgs: Arguments.FileTransport = {
        logFilePath: this.options.file,
        opts: {
          maxSize: this.options.rotation?.maxSize ?? Default.DefaultOptions.rotation?.maxSize,
        },
      };

      this.fileTransport = new FileTransport(fileTransportArgs, new Log(this.options.format ?? 'iso'));
    }
  }
  info(message: string, category?: string) {
    this.log({ message, category, level: 'info' });
  }

  warn(message: string, category?: string) {
    this.log({ message, category, level: 'warn' });
  }

  error(message: string, category?: string) {
    this.log({ message, category, level: 'error' });
  }

  debug(message: string, category?: string) {
    this.log({ message, category, level: 'debug' });
  }

  async close() {
    await this.fileTransport?.close();
  }

  log(args: Arguments.Log) {
    if (this.consoleTransport) {
      this.consoleTransport.log(args);
    }
    if (this.fileTransport) {
      this.fileTransport.log(args);
    }
  }
}
