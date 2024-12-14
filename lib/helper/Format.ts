import { Arguments } from '../types/args';
import { Colors } from './Colors'; // A helper class for ANSI color codes

export class Log {
  private format: 'iso' | 'locale';

  constructor(format: 'iso' | 'locale' = 'iso') {
    this.format = format;
  }

  // Get formatted timestamp
  private getTimestamp(): string {
    const now = new Date();
    return this.format === 'locale' ? now.toLocaleString() : now.toISOString().replace('T', ' ').replace('Z', '');
  }
  formatConsoleMessage({ message, level, category }: { message: string; level: string; category?: string }, color: string): string {
    const timestamp = this.getTimestamp();
    const categoryLabel = category ? `[${category}] ` : '';
    return `${color}[${level.toUpperCase()}] [${timestamp}] ${categoryLabel}> ${message}${Colors.RESET}`;
  }

  /**
   * Formats log messages for file transport with structured timestamp, level, and category
   */
  formatFileMessage({ message, level, category }: Arguments.Format): string {
    const timestamp = this.getTimestamp();
    const categoryLabel = category ? `[${category}] ` : '';

    // Safely handle undefined `level`
    const formattedLevel = level ? level.toUpperCase() : 'UNKNOWN';

    return `[${formattedLevel}] [${timestamp}] ${categoryLabel}> ${message}`;
  }
}
