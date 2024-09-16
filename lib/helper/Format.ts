import { Arguments } from "../types/args";
import { Colors } from "./Colors";

// ASCII Art function to add decorative borders and text
export class Art {
  static getHeader(level: string): string {
    const border = "┌───────────────────────────────────┐";
    const levelLabel = `│ Log Level: [${level.toUpperCase()}]`;
    return `${border}\n${levelLabel}`;
  }

  static getFooter(): string {
    return "└───────────────────────────────────┘\n";
  }
}

export class Format {
  static getTimestamp(format: "iso" | "locale" = "iso"): string {
    const now = new Date();
    return format === "locale"
      ? `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`
      : now.toISOString().replace("T", " ").replace("Z", "");
  }

  static Message(args: Arguments.Format): string {
    const timestamp = Format.getTimestamp(args.format);
    const formattedCategory = args.category
      ? `[${args.category.toUpperCase()}]`
      : "[No Category]";
    return `[${timestamp}] ${formattedCategory}: ${args.message}`;
  }

  static async format(args: Arguments.Format) {
    return Format.Message(args);
  }
}

export class Log {
  public format: "iso" | "locale";

  constructor(format: "iso" | "locale" = "iso") {
    this.format = format;
  }

  // Method to format the message with ASCII Art
  public formatMessage(args: Arguments.Log): string {
    const timestamp = Format.getTimestamp(this.format);
    const formattedCategory = args.category
      ? `[Category: ${args.category.toUpperCase()}]`
      : "[No Category]";
    const header = Art.getHeader(args.level!);
    const footer = Art.getFooter();
    return `
${header}
│ Timestamp: ${timestamp} 
│ ${formattedCategory}
│ Message: ${args.message}
${footer}
    `;
  }
  public formatConsoleMessage(args: Arguments.Format, color: string): string {
    const formattedMessage = this.formatMessage(args);
    return `${color}${formattedMessage}${Colors.TEXT_STYLES().reset}`;
  }
}
