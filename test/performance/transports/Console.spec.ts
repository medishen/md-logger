import { describe } from "node:test";
import assert from "assert";
import { ConsoleTransport } from "../../../lib/transports/Console";
import { Colors } from "../../../lib/helper";
import { LogLevel } from "../../../lib/types";
import { performance } from "perf_hooks";
import test from "node:test";

describe("ConsoleTransport Heavy Performance Test", () => {
  const logColors: Record<LogLevel, string> = {
    info: Colors.MAIN().green,
    warn: Colors.MAIN().yellow,
    error: Colors.MAIN().red,
    debug: Colors.MAIN().brightBlue,
  };

  // Test 1: High-frequency logging
  test("High-Frequency Logging: 100,000 logs", () => {
    const logger = new ConsoleTransport(logColors);
    const start = performance.now();

    for (let i = 0; i < 100000; i++) {
      logger.log(`Message ${i}`, "info", "App");
    }

    const end = performance.now();
    const timeTaken = end - start;

    console.log(
      `High-frequency logging of 100,000 messages took ${timeTaken} ms`
    );
    assert.ok(
      timeTaken < 2000,
      "Performance issue: high-frequency logging is too slow"
    );
  });

  // Test 2: Category switching performance
  test("Category Switching Performance: 50,000 logs with frequent category changes", () => {
    const logger = new ConsoleTransport(logColors);
    const start = performance.now();
    const categories = ["App", "Auth", "DB", "UI", "Network"];

    for (let i = 0; i < 50000; i++) {
      const category = categories[i % categories.length];
      logger.log(`Message ${i}`, "info", category);
    }

    const end = performance.now();
    const timeTaken = end - start;

    console.log(`Logging with category switching took ${timeTaken} ms`);
    assert.ok(
      timeTaken < 2000,
      "Performance issue: category switching is too slow"
    );
  });

  // Test 3: Concurrent logging with multiple instances
  test("Concurrent Logging: Logging to multiple instances concurrently", async () => {
    const logger1 = new ConsoleTransport(logColors);
    const logger2 = new ConsoleTransport(logColors);
    const start = performance.now();

    // Use promises to simulate concurrent logging
    await Promise.all([
      new Promise<void>((resolve) => {
        for (let i = 0; i < 50000; i++) {
          logger1.log(`Message ${i}`, "info", "Service1");
        }
        resolve();
      }),
      new Promise<void>((resolve) => {
        for (let i = 0; i < 50000; i++) {
          logger2.log(`Message ${i}`, "info", "Service2");
        }
        resolve();
      }),
    ]);

    const end = performance.now();
    const timeTaken = end - start;

    console.log(`Concurrent logging took ${timeTaken} ms`);
    assert.ok(
      timeTaken < 3000,
      "Performance issue: concurrent logging is too slow"
    );
  });

  // Test 4: Memory usage during heavy logging
  test("Memory Usage During Heavy Logging: 100,000 logs", () => {
    const logger = new ConsoleTransport(logColors);
    const memoryStart = process.memoryUsage().heapUsed / 1024 / 1024; // MB
    const start = performance.now();

    for (let i = 0; i < 100000; i++) {
      logger.log(`Message ${i}`, "debug", "MemoryTest");
    }

    const end = performance.now();
    const memoryEnd = process.memoryUsage().heapUsed / 1024 / 1024; // MB
    const memoryUsed = memoryEnd - memoryStart;
    const timeTaken = end - start;

    console.log(`Logging took ${timeTaken} ms`);
    console.log(`Memory used: ${memoryUsed.toFixed(2)} MB`);
    assert.ok(timeTaken < 2000, "Performance issue: logging is too slow");
    assert.ok(
      memoryUsed < 50,
      "Memory issue: excessive memory usage during logging"
    );
  });

  // Test 5: Stress test with continuous logging
  test("Stress Test: Continuous logging with 1,000,000 messages", () => {
    const logger = new ConsoleTransport(logColors);
    const start = performance.now();

    for (let i = 0; i < 1000000; i++) {
      logger.log(`Message ${i}`, "warn", "StressTest");
    }

    const end = performance.now();
    const timeTaken = end - start;

    console.log(`Stress logging took ${timeTaken} ms`);
    assert.ok(
      timeTaken < 10000,
      "Performance issue: stress logging is too slow"
    );
  });
});
