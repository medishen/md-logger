import * as fs from 'fs';
import path from 'path';
export class FileStream {
  private fileStream: fs.WriteStream;
  private currentSize: number;
  private fileIndex: number = 0;
  private rotating: boolean = false;
  constructor(private filePath: string) {
    this.filePath = filePath;
    this.currentSize = 0;
    this.fileStream = fs.createWriteStream(this.filePath, { flags: 'a' });
    this.initializeFileSize();
  }

  private async initializeFileSize(): Promise<void> {
    const logDir = path.dirname(this.filePath);
    if (!fs.existsSync(logDir)) {
      await fs.promises.mkdir(logDir, { recursive: true });
    }
    if (fs.existsSync(this.filePath)) {
      const stat = await fs.promises.stat(this.filePath);
      this.currentSize = stat.size;
    } else {
      this.currentSize = 0;
    }
    this.fileStream = fs.createWriteStream(this.filePath, { flags: 'a' });
    try {
    } catch {
      this.currentSize = 0;
    }
  }

  public async write(content: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.fileStream.write(content, (err) => {
        if (err) return reject(err);
        this.currentSize += Buffer.byteLength(content, 'utf8');
        resolve();
      });
    });
  }

  public end(): void {
    this.fileStream.end();
  }

  public getSize(): number {
    return this.currentSize;
  }

  public async rotateFile(): Promise<void> {
    if (this.rotating) return;
    this.rotating = true;

    try {
      this.fileStream.end();
      const rotatedFilePath = `${this.filePath}.${this.fileIndex++}`;
      await fs.promises.rename(this.filePath, rotatedFilePath);
      this.fileStream = fs.createWriteStream(this.filePath, { flags: 'a' });
      this.currentSize = 0;
    } catch (error) {
      console.error('Failed to rotate file', error);
    } finally {
      this.rotating = false;
    }
  }
}
