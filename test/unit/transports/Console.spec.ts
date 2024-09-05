import { describe, test } from "node:test";
import assert from "assert";
import { ConsoleTransport } from "../../../lib/transports/Console";
import { Colors } from "../../../lib/helper";

describe("Console Transprt", () => {
  let logColors = {
    info: Colors.MAIN().green,
    warn: Colors.MAIN().yellow,
    error: Colors.MAIN().red,
    debug: Colors.MAIN().brightBlue,
  };
  test("Info Log", () => {
    const original = console.log;
    let output: string[] = [];
    // Mock console.log without recursion
    const mockedLog = (message: string) => {
      output.push(message);
    };
    // Replace console.log with the mock
    console.log = mockedLog;
    const logger = new ConsoleTransport(logColors);
    logger.log("Info Logging", "info", "App");
    console.log = original;
    // Assert that category name is logged correctly
    assert.strictEqual(
      output.some((log) => log.includes("APP")),
      true,
      "Category name is incorrect"
    );
  });
});
