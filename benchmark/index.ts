import { performance } from "perf_hooks";
import { Factory } from "../lib/logger/Factory";
import { Options } from "../lib/types";

// Options for Factory benchmark (both file and console transports)
const options: Options = {
  level: "info",
  transports: ["console", "file"],
  file: "combined.log",
  rotation: {
    maxSize: 1024 * 1024,
  },
};

// Benchmark for Factory logging 100,000 messages to both transports
async function benchmarkFactory() {
  const factory = new Factory(options);
  const logger = factory.log();
  console.log("Starting Factory benchmark for 100,000 logs...");
  const startTime = performance.now();

  for (let i = 0; i < 100000; i++) {
    logger.info(`Log Message ${i}`);
  }

  const endTime = performance.now();
  const totalTime = endTime - startTime;

  console.log(`Factory benchmark completed: 100,000 logs in ${totalTime} ms`);

  // Ensure all remaining logs are flushed and file stream is closed
  await factory.close();
}

benchmarkFactory();
