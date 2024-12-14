export class Buffers {
  public buffer: string[] = [];
  private bufferSize: number;

  constructor(bufferSize: number) {
    this.bufferSize = bufferSize;
  }

  addToBuffer(logMessage: string): void {
    this.buffer.push(logMessage);
  }

  flushBuffer(): string {
    const content = this.buffer.join('');
    this.buffer = [];
    return content;
  }

  getBufferSize(): number {
    return Buffer.byteLength(this.buffer.join(''), 'utf8');
  }

  isBufferFull(): boolean {
    return this.getBufferSize() >= this.bufferSize;
  }

  clearBuffer(): void {
    this.buffer = [];
  }

  hasContent(): boolean {
    return this.buffer.length > 0;
  }
}
