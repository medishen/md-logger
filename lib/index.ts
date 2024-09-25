import { Default } from "./default";
import { Log } from "./helper/Format";
import { ConsoleTransport } from "./transports/Console";
import { FileTransport } from "./transports/File";
import { Options } from "./types";
import { Arguments } from "./types/args";

export class Logger {
  private opts: Options;
  private fileTransport?: FileTransport;
  private consoleTransport?: ConsoleTransport;
  private formatter: Log;

  constructor(opts: Options) {
    this.opts = opts;
    this.formatter = new Log(opts.format ?? "iso");

    const logColors = opts.console?.colors ?? Default.colors;
    if (opts.file && opts.transports?.includes("file")) {
      this.fileTransport = new FileTransport(
        {
          opts: this.opts.rotation || { maxSize: 1024 * 1024 },
          logFilePath: `logs/${this.opts.file}`,
        },
        this.formatter
      );
    }
    this.consoleTransport = new ConsoleTransport(
      { colors: logColors },
      this.formatter
    );
  }

  private getFileTransport(): FileTransport | undefined {
    return this.fileTransport;
  }

  private getConsoleTransport(): ConsoleTransport {
    return this.consoleTransport!;
  }

  async log(args: Arguments.Log) {
    const logPromises: Promise<void>[] = [];
    const formattedArgs: Arguments.Format = {
      ...args,
      format: this.formatter.format,
      level: "info",
    };
    const fileTransport = this.getFileTransport();
    if (fileTransport) {
      logPromises.push(fileTransport.log(formattedArgs));
    }
    this.getConsoleTransport().log(formattedArgs);
    await Promise.all(logPromises);
  }
  async close() {
    this.fileTransport?.close();
  }
}
