import assert from "node:assert";
import { afterEach, beforeEach, describe, test } from "node:test";
import { Factory } from "../../lib/logger/Factory";
import * as fs from "fs";
import path from "node:path";
const logFilePath = path.resolve(__dirname, "../../logs/app.log");
describe("MAIN LOGGER", () => {
  let logger: Factory;

  beforeEach(() => {
    // Initialize the factory and logger before each test
    logger = new Factory({
      file: "app.log",
      level: "debug",
      transports: ["console", "file"],
      jsonFormat: true,
      timestampFormat: "locale",
    });
  });
  afterEach(async () => {
    // Close factory and clean up files after each test
    await logger.close();
    fs.unlink(logFilePath, (err) => {
      if (err) throw err;
    });
  });
  test("Logger should be initialized with correct transports", () => {
    assert.strictEqual(logger["consoleTransport"] !== undefined, true);
    assert.strictEqual(logger["fileTransport"] !== undefined, true);
  });
  test("Logger should log messages to console", () => {
    // Capture console output
    const originalConsoleLog = console.log;
    let consoleOutput = "";
    console.log = (message: string) => {
      consoleOutput += message;
    };

    logger.log("hi bro", "info");

    // Allow some time for logging to occur
    setImmediate(() => {
      console.log = originalConsoleLog; // Restore original console.log
      assert(consoleOutput.includes("hi bro"));
    });
  });
});
