import assert from "node:assert";
import { afterEach, beforeEach, describe, test } from "node:test";
import { Factory } from "../../lib/logger/Factory";
import { Logger } from "../../lib/logger/index";
import * as fs from "fs";
import path from "node:path";
const logFilePath = path.resolve(__dirname, "../../logs/app.log");
describe("MAIN LOGGER", () => {
  let factory: Factory;
  let logger: Logger;

  beforeEach(() => {
    // Initialize the factory and logger before each test
    factory = new Factory({
      file: "app.log",
      level: "debug",
      transports: ["console", "file"],
      jsonFormat: true,
      timestampFormat: "locale",
    });
    logger = factory.log();
  });
  afterEach(async () => {
    // Close factory and clean up files after each test
    await factory.close();
    fs.unlink(logFilePath, (err) => {
      if (err) throw err;
    });
  });
  test("Logger should be initialized with correct transports", () => {
    assert.strictEqual(factory["consoleTransport"] !== undefined, true);
    assert.strictEqual(factory["fileTransport"] !== undefined, true);
  });
  test("Logger should log messages to console", () => {
    // Capture console output
    const originalConsoleLog = console.log;
    let consoleOutput = "";
    console.log = (message: string) => {
      consoleOutput += message;
    };

    logger.info("hi bro");

    // Allow some time for logging to occur
    setImmediate(() => {
      console.log = originalConsoleLog; // Restore original console.log
      assert(consoleOutput.includes("hi bro"));
    });
  });
});
