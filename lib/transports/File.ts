import { Operation } from "../operation";
import { Arguments } from "../types/args";
import { Log } from "../helper/Format";
export class FileTransport extends Operation.File {
  constructor(args: Arguments.FileTransport, private formatter: Log) {
    super(args);
  }
  async log(args: Arguments.Format): Promise<void> {
    const formattedMessage = this.formatter.formatMessage(args);
    const messageSize = Buffer.byteLength(formattedMessage, "utf8");
    this.logBuffer.buffer.push(formattedMessage);
    if (this.shouldFlush(messageSize)) {
      await this.flush();
    }
  }
  async close(): Promise<void> {
    this.stopAutoFlush();
    await this.flush();
    this.fileStream.end();
  }
}
