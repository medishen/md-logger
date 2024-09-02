import { LogLevel } from "../types";

export class Colors {
  // Base colors
  static MAIN() {
    return {
      black: "\x1b[30m",
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      magenta: "\x1b[35m",
      cyan: "\x1b[36m",
      white: "\x1b[37m",
      gray: "\x1b[90m",
      brightRed: "\x1b[91m",
      brightGreen: "\x1b[92m",
      brightYellow: "\x1b[93m",
      brightBlue: "\x1b[94m",
      brightMagenta: "\x1b[95m",
      brightCyan: "\x1b[96m",
      brightWhite: "\x1b[97m",
    };
  }

  // Background colors
  static BACKGROUND() {
    return {
      BGblack: "\x1b[40m",
      BGred: "\x1b[41m",
      BGgreen: "\x1b[42m",
      BGyellow: "\x1b[43m",
      BGblue: "\x1b[44m",
      BGmagenta: "\x1b[45m",
      BGcyan: "\x1b[46m",
      BGwhite: "\x1b[47m",
      BGgray: "\x1b[48;5;235m",
      BGbrightRed: "\x1b[48;5;196m",
      BGbrightGreen: "\x1b[48;5;46m",
      BGbrightYellow: "\x1b[48;5;226m",
      BGbrightBlue: "\x1b[48;5;21m",
      BGbrightMagenta: "\x1b[48;5;201m",
      BGbrightCyan: "\x1b[48;5;51m",
      BGbrightWhite: "\x1b[48;5;255m",
      // Extended 256-color backgrounds
      BGdarkRed: "\x1b[48;5;124m",
      BGdarkGreen: "\x1b[48;5;28m",
      BGdarkYellow: "\x1b[48;5;136m",
      BGdarkBlue: "\x1b[48;5;19m",
      BGdarkMagenta: "\x1b[48;5;125m",
      BGdarkCyan: "\x1b[48;5;30m",
    };
  }

  // Text styles
  static TEXT_STYLES() {
    return {
      reset: "\x1b[0m",
      bright: "\x1b[1m",
      dim: "\x1b[2m",
      underscore: "\x1b[4m",
      blink: "\x1b[5m",
      reverse: "\x1b[7m",
      hidden: "\x1b[8m",
      italic: "\x1b[3m",
      strikethrough: "\x1b[9m",
    };
  }

  // Additional font styles (not supported by all terminals)
  static OTHER() {
    return {
      fontDefault: "\x1b[10m",
      font1: "\x1b[11m",
      font2: "\x1b[12m",
      font3: "\x1b[13m",
      font4: "\x1b[14m",
      font5: "\x1b[15m",
      font6: "\x1b[16m",
      font7: "\x1b[17m",
      font8: "\x1b[18m",
      font9: "\x1b[19m",
    };
  }
}
export class Format {
  static getTimestamp(format: "iso" | "locale"): string {
    const now = new Date();
    return format === "locale"
      ? `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`
      : now.toISOString().replace("T", " ").replace("Z", "");
  }
  static Message(
    message: string,
    level: LogLevel,
    category?: string,
    format: "iso" | "locale" = "iso"
  ): string {
    const timestamp = Format.getTimestamp(format);
    const formattedCategory = category ? `[${category.toUpperCase()}]` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${formattedCategory}: ${message}`;
  }
}
export const logLevels: Record<LogLevel, number> = {
  info: 1,
  warn: 2,
  error: 3,
  debug: 4,
};