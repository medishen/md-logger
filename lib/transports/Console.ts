import { LogLevel } from "../types";
import { Colors } from "../helper";
export class ConsoleTransport {
  private lastCategory?: string;
  private logColors: Record<LogLevel, string>;

  constructor(colors: Record<LogLevel, string>) {
    this.logColors = colors;
  }

  log(message: string, level: LogLevel, category?: string) {
    const color = this.logColors[level];
    const categoryPart =
      category && category !== this.lastCategory
        ? `${category.toUpperCase()}: `
        : "";
    const logMessage = `${color}${categoryPart}${message}${
      Colors.TEXT_STYLES().reset
    }\n`;

    if (category && category !== this.lastCategory) {
      console.log(logMessage);
      this.lastCategory = category;
    } else {
      console.log(logMessage);
    }
  }
}
