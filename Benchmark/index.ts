import { performance } from "perf_hooks";
import * as fs from "fs";
import * as path from "path";
import { Options } from "../lib/types";
import { Factory } from "../lib/logger/Factory";

// Configuration for benchmarking
const loggerOptions: Options = {
  level: "debug",
  file: "benchmark.log",
  timestampFormat: "iso",
};

// Create a logger instance
const logger = Factory.create(loggerOptions);

// Function to perform the benchmark
async function benchmarkLogging(iterations: number) {
  const logMessages: string[] = [];

  // Generate sample log messages
  for (let i = 0; i < iterations; i++) {
    logMessages.push(`Benchmark message ${i}`);
  }

  const startTime = performance.now();

  // Log messages
  for (const message of logMessages) {
    await logger.info({ message: message, category: "Benchmark" });
  }

  const endTime = performance.now();
  const duration = (endTime - startTime) 
  const throughput = iterations / duration; 

  // Output results
  console.log(
    `Logged ${iterations} messages in ${duration.toFixed(2)} seconds.`
  );
  console.log(`Throughput: ${throughput.toFixed(2)} messages/second`);

  // Optionally read the log file to verify entries
  const logFilePath = path.join(__dirname, "benchmark.log");
  if (fs.existsSync(logFilePath)) {
    const logContent = fs.readFileSync(logFilePath, "utf-8");
    console.log(`Log file contains ${logContent.split("\n").length} lines.`);
  }

  // Shutdown the logger
  logger.shutdown();
  console.log("Logger has been shut down.");
}

// Run the benchmark with a specified number of iterations
benchmarkLogging(10000).catch((error) => {
  console.error("Benchmark failed:", error);
});
