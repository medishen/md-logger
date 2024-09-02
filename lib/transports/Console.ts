import { LogLevel } from "../types";
import { Colors } from "../helper";

export class ConsoleTransport {
  private lastCategory?: string;
  private logColors: Record<LogLevel, string>;

  constructor(colors: Record<LogLevel, string>) {
    this.logColors = colors;
  }

  log(message: string, level: LogLevel, category?: string) {
    if (category && category !== this.lastCategory) {
      console.log(
        `${this.logColors[level]}${category.toUpperCase()}: ${
          Colors.TEXT_STYLES().reset
        }`
      );
      this.lastCategory = category;
    }
    console.log(
      `${this.logColors[level]}${message}${Colors.TEXT_STYLES().reset}\n`
    );
  }
}
