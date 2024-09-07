import { performance } from "perf_hooks";
import { Factory } from "../lib/logger/Factory";
import { Options } from "../lib/types";

// Options for Factory benchmark (both file and console transports)
const options: Options = {
  level: "info",
  transports: ["file", "console"], // Add both transports to test
  file: "combined.log",
  rotation: {
    maxSize: 1024 * 1024,
  },
};

async function benchmarkFactory() {
  const logger = new Factory(options);

  // Start CPU and memory measurement
  const initialCpuUsage = process.cpuUsage();
  const initialMemoryUsage = process.memoryUsage().heapUsed;

  console.log("Starting Factory benchmark for 100,000 logs...");
  const startTime = performance.now();

  const logCount = 100000; // Change this value for larger benchmarks
  for (let i = 0; i < logCount; i++) {
    await logger.log(`Log Message ${i}`, "info");
  }
  await logger.close();

  const endTime = performance.now();
  const totalTime = endTime - startTime;

  // Log throughput: logs per second
  const logsPerSecond = (logCount / totalTime) * 1000;

  // End CPU and memory measurement
  const finalCpuUsage = process.cpuUsage(initialCpuUsage);
  const finalMemoryUsage = process.memoryUsage().heapUsed;

  // CPU time consumed (user + system) in milliseconds
  const cpuTime = (finalCpuUsage.user + finalCpuUsage.system) / 1000;

  // Output benchmark results
  console.log(
    `Factory benchmark completed: ${logCount} logs in ${totalTime.toFixed(
      2
    )} ms`
  );
  console.log(`Logs per second: ${logsPerSecond.toFixed(2)} logs/sec`);

  // Memory usage difference
  const memoryUsed = (finalMemoryUsage - initialMemoryUsage) / 1024 / 1024; // Convert to MB
  console.log(`Memory used: ${memoryUsed.toFixed(2)} MB`);

  // CPU usage
  console.log(`CPU time used: ${cpuTime.toFixed(2)} ms`);

  // Close the logger (important for cleanup)
  await logger.close();
}

// Run the benchmark
benchmarkFactory();
