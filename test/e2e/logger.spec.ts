import { after, before, describe, it } from "node:test";
import * as fs from "fs/promises";
import { Options } from "../../lib/types";
import { Factory } from "../../lib/logger/Factory";
import assert from "assert";
import path from "path";

const testLogFile = "combined.log";
const pathFIle = path.join(process.cwd(), "logs", testLogFile);
describe("Factory End-to-End Tests", function () {
  it("should log messages to file and console", async function () {
    const options: Options = {
      level: "info",
      transports: ["file"],
      file: "combined.log",
      rotation: {
        maxSize: 1024 * 1024, // 1 MB
      },
    };

    const logger = new Factory(options);

    // Write logs
    for (let i = 0; i < 10; i++) {
      await logger.log(`Log Message ${i}`, "info");
    }

    await logger.close();

    // Check if file was created and contains logs
    const fileStats = await fs.stat(pathFIle);
    assert(fileStats.size > 0, "Log file should be created and not empty");

    // Read the file content and validate
    const fileContent = await fs.readFile(pathFIle, "utf8");
    for (let i = 0; i < 10; i++) {
      assert(
        fileContent.includes(`Log Message ${i}`),
        `File should contain 'Log Message ${i}'`
      );
    }
  });

  it("should handle file rotation", async function () {
    const options: Options = {
      level: "info",
      transports: ["file"],
      file: "combined.log",
      rotation: {
        maxSize: 10, // Small size for testing rotation
      },
    };

    const logger = new Factory(options);

    // Write logs to trigger rotation
    for (let i = 0; i < 50; i++) {
      await logger.log(`Log Message ${i}`, "info");
    }

    await logger.close();

    // Check if rotated files exist
    const fileExists = async (filePath: string) => {
      try {
        await fs.stat(filePath);
        return true;
      } catch {
        return false;
      }
    };

    const rotatedFileExists = await fileExists(`${pathFIle}.0`);
    assert(rotatedFileExists, "Rotated log file should exist");

    // Validate content in the rotated file
    const rotatedFileContent = await fs.readFile(`${pathFIle}.0`, "utf8");
    assert(
      rotatedFileContent.includes("Log Message 0"),
      "Rotated file should contain logs"
    );
  });
});
