import { Colors } from "../helper";
import { ConsoleTransport } from "../transports/Console";
import { FileTransport } from "../transports/File";
import { LogLevel, Options } from "../types";

const defaultLogColors = {
  info: Colors.MAIN().green,
  warn: Colors.MAIN().yellow,
  error: Colors.MAIN().red,
  debug: Colors.MAIN().brightBlue,
};

export class Factory {
  private opts: Options;
  private fileTransport?: FileTransport;
  private consoleTransport?: ConsoleTransport;

  constructor(opts: Options) {
    this.opts = opts;
    const logColors = opts.console?.colors ?? defaultLogColors;
    if (opts.file) {
      this.fileTransport = new FileTransport(
        `logs/${this.opts.file}`,
        this.opts.rotation
      );
    }
    this.consoleTransport = new ConsoleTransport(logColors);
  }

  private getFileTransport(): FileTransport | undefined {
    return this.fileTransport;
  }

  private getConsoleTransport(): ConsoleTransport {
    return this.consoleTransport!;
  }

  async log(message: string, level: LogLevel, category?: string) {
    const logPromises: Promise<void>[] = [];
    const fileTransport = this.getFileTransport();
    if (fileTransport) {
      logPromises.push(fileTransport.log(message, level, category));
    }
    this.getConsoleTransport().log(message, level, category);
    await Promise.all(logPromises);
  }
  async close() {
    this.fileTransport?.close();
  }
}
