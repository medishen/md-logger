import assert from "assert";
import { describe, test, afterEach } from "node:test";
import path from "path";
import { performance } from "perf_hooks";
import { promises as fsPromises } from "fs";
import { FileTransport } from "../../../lib/transports/File";
describe("FileTransport Performance Test", () => {
  afterEach(async () => {
    const filePattern = /^.*\.log(?:\.\d+)?$/;
    const logDir = path.join(__dirname);
    const files = await fsPromises.readdir(logDir);
    const logFiles = files.filter((file) => filePattern.test(file));
    for (const file of logFiles) {
      await fsPromises.rm(path.join(logDir, file), { force: true });
    }
  });
  test("Create 10000 File Logs", () => {
    const start = performance.now();
    for (let i = 0; i < 10000; i++) {
      const file = new FileTransport(path.join(__dirname, `test-${i}.log`));
      file.log("TEST LOG FILE ", "info", "APP");
    }
    const end = performance.now();
    const timeTaken = end - start;
    console.log(`Logging 10000 Create files took ${timeTaken} ms`); // According to this test, it creates every 10,000 thousand files in approximately 0.5 seconds
    assert.ok(timeTaken < 1000, "Performance issue: logging is too slow");
    console.log(`Completed Created 10000 Files`);
  });
  test("Log with frequent rotations", async () => {
    const logFilePath = path.join(__dirname, `frequent-rotation.log`);
    console.log(`Start Created 10000 backup files with 10 bytes`);
    const start = performance.now();
    const fileTransport = new FileTransport(logFilePath, {
      maxSize: 10,
    });
    for (let i = 0; i < 10000; i++) {
      await fileTransport.log(`Log message ${i}`, "info");
    }
    fileTransport.close();
    const end = performance.now();
    const timeTaken = end - start;
    console.log(`Logging with frequent rotations took ${timeTaken} ms`);
    assert.ok(timeTaken, "Performance issue: frequent rotation is too slow");
    console.log(`Completed Created 10000 backup files with 10 bytes`);
  });
});
