import { test, describe } from "node:test";
import * as fs from "fs";
import * as path from "path";
import { Factory } from "../../../lib/logger/Factory";
import { Options } from "../../../lib/types";
import assert from "assert";
describe("FACTORY", () => {
  const logPath = path.join(process.cwd(), "logs");
  test("Logging with error in file", () => {
    const logFilePathError = path.join(logPath, "Error.log");
    const options: Options = {
      level: "error",
      timestampFormat: "locale",
      file: "Error.log",
      transports: ["console", "file"],
    };

    const logger = Factory.create(options);

    try {
      throw new SyntaxError("Syntax Error in line 16");
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        logger.error({ error: error, category: "Syntax Error" });
      }
    }
    const isFileCreated = fs.existsSync(logFilePathError);
    console.log("isFileCreated", isFileCreated);
    assert.ok(isFileCreated, "Log file should be created");
    if (isFileCreated) {
      const logFileContent = fs.readFileSync(logFilePathError, "utf-8");
      console.log("logFileContent", logFileContent);
      assert.ok(
        logFileContent.includes(
          "[ERROR] [SYNTAX ERROR]: Syntax Error in line 16"
        ),
        "Log file should contain the error message"
      );
    }
  });
  // test("Increasing the size of the file more than the size of rotation", async () => {
  //   const rotationFilePath = path.join(logPath, "rotation.log");
  //   const opts: Options = {
  //     file: "rotation.log",
  //     level: "debug",
  //     rotation: {
  //       maxFiles: 2,
  //       maxSize: 100,
  //     },
  //     transports: ["file"],
  //   };
  //   const logger = Factory.create(opts);
  //   const logMessage = "x".repeat(250);
  //   for (let i = 0; i < 10; i++) {
  //     await logger.debug(logMessage);
  //   }
  //   // Introduce a delay to ensure file operations are complete
  //   console.log("rotationFilePath", rotationFilePath);
  //   const isFileCreated = fs.existsSync(rotationFilePath);
  //   console.log("isFileCreated", isFileCreated);
  //   assert.ok(isFileCreated, "Rotation file should exist");

  //   // Check for the existence of rotated files
  //   for (let i = 0; i < 2; i++) {
  //     const backupFile = path.join(logPath, `rotation.log.${i}`);
  //     assert.ok(fs.existsSync(backupFile), `Backup file ${i} should exist`);
  //   }
  // });
});
