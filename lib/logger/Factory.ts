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
    const consoleTransport = options.transports?.includes("console")
      ? new ConsoleTransport(logColors)
      : undefined;
    const fileTransport =
      options.file && options.transports?.includes("file")
        ? new FileTransport(
            `logs/${options.file}`,
            options.rotation || undefined
          )
        : undefined;
    return new Logger(options, consoleTransport, fileTransport);
  }
}
