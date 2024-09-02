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
  static create(options: Options): Logger {
    const consoleTransport = new ConsoleTransport(logColors);
    const fileTransport = options.file
      ? new FileTransport(`logs/${options.file}`)
      : undefined;
    return new Logger(options, consoleTransport, fileTransport);
  }
}
