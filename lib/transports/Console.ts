import { LogLevel } from '../types';
import { Transport } from '.';
import { Arguments } from '../types/args';
import { Log } from '../helper/Format';

export class ConsoleTransport implements Transport {
  private lastCategory?: string;
  private logColors: Record<LogLevel, string>;

  constructor(args: Arguments.ConsoleTransport, private formatter: Log) {
    this.logColors = args.colors;
  }

  log(args: Arguments.Format): void {
    const level = args.level ?? 'info';
    const color = this.logColors[level as LogLevel];
    const formattedMessage = this.formatter.formatConsoleMessage({ ...args, level }, color);

    // Print category change with spacing
    if (args.category && args.category !== this.lastCategory) {
      console.log(`\n${formattedMessage}`);
      this.lastCategory = args.category;
    } else {
      console.log(formattedMessage);
    }
  }
}
