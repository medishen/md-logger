import { LogLevel } from "../types";
import { Colors } from "../helper/Colors";
import { Transport } from ".";
import { Arguments } from "../types/args";
import { Log } from "../helper/Format";
export class ConsoleTransport implements Transport {
  private lastCategory?: string;
  private logColors: Record<LogLevel, string>;
  constructor(args: Arguments.ConsoleTransport, private formatter: Log) {
    this.logColors = args.colors;
  }
  log(args: Arguments.Format): void {
    const color = this.logColors[args.level!];
    const formattedMessage = this.formatter.formatConsoleMessage(args, color);
    if (args.category && args.category !== this.lastCategory) {
      console.log(formattedMessage);
      this.lastCategory = args.category;
    } else {
      console.log(formattedMessage);
    }
  }
}
