import { Logger } from ".";
import { Colors } from "../helper";
import { ConsoleTransport } from "../transports/Console";
import { FileTransport } from "../transports/File";
import { Options } from "../types";
const logColors = {
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
  }
  log(): Logger {
    this.consoleTransport = this.opts.transports?.includes("console")
      ? new ConsoleTransport(logColors)
      : undefined;
    this.fileTransport =
      this.opts.file && this.opts.transports?.includes("file")
        ? new FileTransport(`logs/${this.opts.file}`, this.opts.rotation)
        : undefined;
    return new Logger(this.opts, this.consoleTransport, this.fileTransport);
  }
  async close() {
    // Close file transport if it exists
    if (this.fileTransport) {
      await this.fileTransport.close();
    }
  }
}
