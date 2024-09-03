import { after, before, test, describe } from "node:test";
import assert from "assert";
import { FileTransport } from "../../../lib/transports/File";
import path from "path";
import { promises as fsPromises } from "fs";
import * as fs from "fs";
const testFilePath = path.join(__dirname, "test.log");
const maxSizeFilePath = path.join(__dirname, "maxSize.log");
describe("FileTransport", () => {
  after(async () => {
    const filePattern = /^.*\.log(?:\.\d+)?$/;
    const logDir = path.join(__dirname);
    const files = await fsPromises.readdir(logDir);
    const logFiles = files.filter((file) => filePattern.test(file));
    console.log("files", files);
    console.log("logFiles", logFiles);
    for (const file of logFiles) {
      await fsPromises.rm(path.join(logDir, file), { force: true });
    }
  });

  test("should create the log file and write a message", async () => {
    const transport = new FileTransport(testFilePath);
    await transport.log("Hello, world!", "info");
    const content = await fsPromises.readFile(testFilePath, "utf8");
    assert.ok(content.includes("Hello, world!"));
    transport.close();
  });
  test("should rotate files when exceeding maxSize", async () => {
    const maxSize = 50;
    const transport = new FileTransport(maxSizeFilePath, {
      maxSize,
      maxFiles: 2,
    });

    const logMessage = "*".repeat(60); // 60 bytes
    const { rotatedFiles } = await transport.log(logMessage, "info");
    rotatedFiles.forEach((rotatedFilePath, i) => {
      const exists = fs.existsSync(rotatedFilePath);
      assert.strictEqual(exists, true);
      const content = fs.readFileSync(rotatedFilePath, "utf8");
      assert.strictEqual(content, logMessage + "\n");
    });
    const currentLogContent = fs.readFileSync(maxSizeFilePath, "utf8");
    assert.strictEqual(currentLogContent, logMessage + "\n");
    transport.close();
  });
});
