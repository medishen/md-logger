import assert from "assert";
import { Logger } from "../../../lib/logger/index";
import { describe, test, afterEach } from "node:test";
import path from "path";
import { ConsoleTransport } from "../../../lib/transports/Console";
import { Colors } from "../../../lib/helper";
import { FileTransport } from "../../../lib/transports/File";
import { promises as fsPromises } from "fs";
import * as fs from "fs";
describe("LOGGER", () => {
  const logFilePath = path.join(__dirname, "app.log");
  const Console = new ConsoleTransport({
    info: Colors.MAIN().green,
    warn: Colors.MAIN().yellow,
    error: Colors.MAIN().red,
    debug: Colors.MAIN().brightBlue,
  });
  const FIle = new FileTransport(logFilePath, {
    maxSize: 1024,
  });
  const logger = new Logger(
    {
      level: "info",
      file: "app.log",
      transports: ["console"],
      rotation: {
        maxSize: 1024, //1kb
      },
      jsonFormat: true,
      timestampFormat: "locale",
    },
    Console,
    FIle
  );
  afterEach(async () => {
    const filePattern = /^.*\.log(?:\.\d+)?$/;
    const logDir = path.join(__dirname);
    const files = await fsPromises.readdir(logDir);
    const logFiles = files.filter((file) => filePattern.test(file));
    for (const file of logFiles) {
      await fsPromises.rm(path.join(logDir, file), { force: true });
    }
  });
  test("log with files", async () => {
    logger.info("test");
    const logFileContent = fs.readFileSync(logFilePath, "utf8");
    assert.ok(
      logFileContent.includes("[INFO] : test"),
      "Log file should contain the message 'test'"
    );
    const original = console.log;
    let output: string[] = [];
    // Mock console.log without recursion
    const mockedLog = (message: string) => {
      output.push(message);
    };
    // Replace console.log with the mock
    console.log = mockedLog;

    await logger.info("console test");
    console.log = original;
    // Assert that category name is logged correctly
    assert.strictEqual(
      output.some((log) => log.includes("console test")),
      true,
      "Category name is incorrect"
    );
  });
});
