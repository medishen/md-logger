import * as fs from "fs";
import * as path from "path";
import { LogLevel } from "../types";

export class FileTransport {
  private fileStream: fs.WriteStream;
  private lastCategory?: string;
  private logFilePath: string;

  constructor(logFilePath: string) {
    this.logFilePath = logFilePath;

    // Ensure the directory exists
    const logDir = path.dirname(this.logFilePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Create or open the log file
    this.fileStream = fs.createWriteStream(this.logFilePath, { flags: "a" });
  }

  log(message: string, level: LogLevel, category?: string) {
    if (category && category !== this.lastCategory) {
      this.fileStream.write(`${category.toUpperCase()}:\n`);
      this.lastCategory = category;
    }
    this.fileStream.write(`${message}\n`);
  }

  close() {
    this.fileStream.end();
  }
}
