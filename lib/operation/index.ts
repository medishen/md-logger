import { Arguments } from '../types/args';
import { Default } from '../default';
import { Buffers } from './Buffer';
import { FileStream } from './FileStream';
export namespace Operation {
  export class File {
    protected logBuffer: Buffers;
    protected fileStream: FileStream;
    private maxSize: number;
    private autoFlushInterval: number;
    private flushTimeout: NodeJS.Timeout | null;
    constructor({ logFilePath, opts }: Arguments.FileTransport) {
      this.maxSize = opts?.maxSize || Default.ConfigFiles.maxSize;
      this.autoFlushInterval = opts?.autoFlushInterval || Default.ConfigFiles.autoFlushInterval;
      this.logBuffer = new Buffers(opts?.bufferSize || 1024);
      this.flushTimeout = null;
      this.fileStream = new FileStream(logFilePath);
      this.startAutoFlush();
    }
    protected shouldFlush(messageSize: number): boolean {
      return this.logBuffer.isBufferFull() || this.fileStream.getSize() + messageSize > this.maxSize;
    }
    protected async flush(): Promise<void> {
      const bufferContent = this.logBuffer.flushBuffer();
      const bufferSize = Buffer.byteLength(bufferContent, 'utf8');

      if (bufferSize === 0) return;

      await this.fileStream.write(bufferContent);

      if (this.fileStream.getSize() >= this.maxSize) {
        await this.rotateFiles();
      }
    }
    private startAutoFlush(): void {
      this.flushTimeout = setInterval(() => {
        this.flush().catch((err) => console.error('Auto-flush error:', err));
      }, this.autoFlushInterval);
    }
    protected stopAutoFlush(): void {
      if (this.flushTimeout) {
        clearInterval(this.flushTimeout);
        this.flushTimeout = null;
      }
    }
    private async rotateFiles(): Promise<void> {
      await this.fileStream.rotateFile();
    }
  }
}
