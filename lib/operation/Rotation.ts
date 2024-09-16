import * as fs from "fs/promises";

export class Rotation {
  private fileIndex: number = 0;
  private maxFiles: number; 

  constructor(maxFiles: number = Infinity) {
    this.maxFiles = maxFiles;
  }

  async rotate(filePath: string): Promise<void> {
    const rotatedFilePath = `${filePath}.${this.fileIndex++}`;
    await fs.rename(filePath, rotatedFilePath);
  }

  async cleanupOldFiles(logDir: string, baseFileName: string): Promise<void> {
    // Optional: Remove older log files if `maxFiles` is set
    const files = await fs.readdir(logDir);
    const rotatedFiles = files.filter((file) => file.startsWith(baseFileName));

    if (rotatedFiles.length > this.maxFiles) {
      const filesToRemove = rotatedFiles.slice(
        0,
        rotatedFiles.length - this.maxFiles
      );
      await Promise.all(
        filesToRemove.map((file) => fs.unlink(`${logDir}/${file}`))
      );
    }
  }
}
