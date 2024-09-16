import { after, before, test, describe } from "node:test";
import assert from "assert";
import { FileTransport } from "../../../lib/transports/File";
import path from "path";
import { promises as fsPromises } from "fs";
import { performance } from "perf_hooks";
import { Log } from "../../../lib/helper/Format";
const testFilePath = path.join(__dirname, "test.log");
describe("FileTransport", () => {
  const formatter = new Log("iso");
  after(async () => {
    const filePattern = /^.*\.log(?:\.\d+)?$/;
    const logDir = path.join(__dirname);
    const files = await fsPromises.readdir(logDir);
    const logFiles = files.filter((file) => filePattern.test(file));
    for (const file of logFiles) {
      await fsPromises.rm(path.join(logDir, file), { force: true });
    }
  });

  test("should create the log file and write a message", async () => {
    const start = performance.now();
    const logger = new FileTransport({ logFilePath: testFilePath }, formatter);
    await logger.log({
      message: "Hello, world!",
      format: "iso",
      level: "info",
      category: "APP",
    });
    await logger.close();
    const content = await fsPromises.readFile(testFilePath, "utf8");
    const end = performance.now();
    const timeTaken = end - start;
    console.log(`Logging with ${timeTaken} ms`);
    assert.ok(content.includes("Hello, world!"));
  });
});
