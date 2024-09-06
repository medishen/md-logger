import assert from "assert";
import { describe, test, beforeEach, afterEach } from "node:test";
import path from "path";
import { performance } from "perf_hooks";
import { promises as fsPromises } from "fs";
import { FileTransport } from "../../../lib/transports/File";

// Utility to clean up test log files after each test
const cleanUpLogFiles = async () => {
  const filePattern = /^.*\.log(?:\.\d+)?$/;
  const logDir = path.join(__dirname);
  const files = await fsPromises.readdir(logDir);
  const logFiles = files.filter((file) => filePattern.test(file));
  for (const file of logFiles) {
    await fsPromises.rm(path.join(logDir, file), { force: true });
  }
};

describe("FileTransport Strong Performance Test", () => {
  // Clean up logs before and after each test
  beforeEach(cleanUpLogFiles);
  afterEach(cleanUpLogFiles);

  test("High-Frequency Logging: 50,000 logs without rotation", async () => {
    const logFilePath = path.join(__dirname, "high-frequency.log");
    const fileTransport = new FileTransport(logFilePath, {
      maxSize: 100 * 1024 * 1024, // 100 MB to prevent rotation
      bufferSize: 4096, // 4 KB buffer size
      autoFlushInterval: 500, // Flush every 500ms
    });

    const start = performance.now();

    for (let i = 0; i < 50000; i++) {
      await fileTransport.log(`High-frequency log message ${i}`, "info");
    }

    await fileTransport.close(); // Ensure logs are flushed before ending

    const end = performance.now();
    const timeTaken = end - start;

    console.log(`High-frequency logging took ${timeTaken.toFixed(2)} ms`);
    assert.ok(timeTaken < 5000, "Performance issue: logging too slow");
  });

  test("Large File Size and Rotation: 10,000 logs with rotation", async () => {
    const logFilePath = path.join(__dirname, "large-file.log");
    const fileTransport = new FileTransport(logFilePath, {
      maxSize: 1000, // 1 KB max file size for frequent rotation
      bufferSize: 512, // 512 B buffer size
      autoFlushInterval: 200, // Flush every 200ms
    });

    const start = performance.now();

    for (let i = 0; i < 10000; i++) {
      await fileTransport.log(`Rotating log message ${i}`, "info");
    }

    await fileTransport.close();

    const end = performance.now();
    const timeTaken = end - start;

    console.log(`Logging with rotation took ${timeTaken.toFixed(2)} ms`);
    const rotatedFiles = (await fsPromises.readdir(__dirname)).filter((file) =>
      file.startsWith("large-file.log.")
    );
    console.log(`Rotated files count: ${rotatedFiles.length}`);

    assert.ok(rotatedFiles.length > 0, "No log rotation occurred.");
    assert.ok(timeTaken < 10000, "Performance issue: rotation too slow");
  });

  test("Concurrent Logging to Multiple Files", async () => {
    const logFilePaths = Array.from({ length: 10 }, (_, i) =>
      path.join(__dirname, `concurrent-log-${i}.log`)
    );

    const transports = logFilePaths.map(
      (logFilePath) =>
        new FileTransport(logFilePath, {
          maxSize: 1024 * 1024, // 1 MB max size
          bufferSize: 2048, // 2 KB buffer
          autoFlushInterval: 500, // Flush every 500ms
        })
    );

    const start = performance.now();

    // Log to all files concurrently
    await Promise.all(
      transports.map(async (transport, idx) => {
        for (let i = 0; i < 5000; i++) {
          await transport.log(`Concurrent log ${i} for file ${idx}`, "info");
        }
        await transport.close();
      })
    );

    const end = performance.now();
    const timeTaken = end - start;

    console.log(
      `Concurrent logging to multiple files took ${timeTaken.toFixed(2)} ms`
    );
    assert.ok(
      timeTaken < 10000,
      "Performance issue: concurrent logging too slow"
    );
  });

  test("Memory Usage During Heavy Logging", async () => {
    const logFilePath = path.join(__dirname, "memory-usage.log");
    const fileTransport = new FileTransport(logFilePath, {
      maxSize: 10 * 1024 * 1024, // 10 MB
      bufferSize: 4096, // 4 KB buffer size
      autoFlushInterval: 1000, // Flush every second
    });

    const startMemory = process.memoryUsage().heapUsed;

    const start = performance.now();
    for (let i = 0; i < 50000; i++) {
      await fileTransport.log(`Memory usage log ${i}`, "info");
    }
    await fileTransport.close();
    const endMemory = process.memoryUsage().heapUsed;

    const memoryUsed = (endMemory - startMemory) / 1024 / 1024; // MB
    const end = performance.now();
    const timeTaken = end - start;

    console.log(`Logging took ${timeTaken.toFixed(2)} ms`);
    console.log(`Memory used: ${memoryUsed.toFixed(2)} MB`);

    assert.ok(memoryUsed < 50, "Memory usage exceeded 50 MB");
    assert.ok(timeTaken < 10000, "Performance issue: logging too slow");
  });

  test("Log Rotation Under Stress: Continuous logging with small file sizes", async () => {
    const logFilePath = path.join(__dirname, "stress-rotation.log");
    const fileTransport = new FileTransport(logFilePath, {
      maxSize: 1024, // 1 KB max size for frequent rotation
      bufferSize: 512, // 512 B buffer size
      autoFlushInterval: 100, // Flush every 100ms
    });

    const start = performance.now();

    for (let i = 0; i < 20000; i++) {
      await fileTransport.log(`Stress log message ${i}`, "info");
    }

    await fileTransport.close();

    const end = performance.now();
    const timeTaken = end - start;

    console.log(`Stress logging and rotation took ${timeTaken.toFixed(2)} ms`);
    const rotatedFiles = (await fsPromises.readdir(__dirname)).filter((file) =>
      file.startsWith("stress-rotation.log.")
    );
    console.log(`Rotated files count: ${rotatedFiles.length}`);

    assert.ok(
      rotatedFiles.length > 0,
      "No log rotation occurred under stress."
    );
    assert.ok(timeTaken < 10000, "Performance issue: stress logging too slow");
  });
});
