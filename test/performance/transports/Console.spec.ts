import { describe } from "node:test";
import assert from "assert";
import { ConsoleTransport } from "../../../lib/transports/Console";
import { Colors } from "../../../lib/helper";
import { LogLevel } from "../../../lib/types";
import { performance } from "perf_hooks";
import test from "node:test";

describe("ConsoleTransport Performance Test", () => {
  const logColors: Record<LogLevel, string> = {
    info: Colors.MAIN().green,
    warn: Colors.MAIN().yellow,
    error: Colors.MAIN().red,
    debug: Colors.MAIN().brightBlue,
  };

  test("Performance of logging multiple messages", () => {
    const logger = new ConsoleTransport(logColors);
    const start = performance.now();

    for (let i = 0; i < 10000; i++) {
      logger.log(`Message ${i}`, "info", "App");
    }
    // logger.flush();

    const end = performance.now();
    const timeTaken = end - start;

    console.log(`Logging 10000 messages took ${timeTaken} ms`); // 300.000 ms ~ 200.000 ms

    // You can add an assertion to ensure it stays under a threshold
    assert.ok(timeTaken < 1000, "Performance issue: logging is too slow");
  });
});
