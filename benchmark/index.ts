import { performance } from "perf_hooks";
import { Logger } from "../lib/";
import { Options } from "../lib/types";

const options: Options = {
  transports: ["file", "console"],
  file: "combined.log",
  rotation: {
    maxSize: 1024 * 1024,
  },
};

async function benchmarkFactory() {
  const logger = new Logger(options);
  const initialCpuUsage = process.cpuUsage();
  const initialMemoryUsage = process.memoryUsage().heapUsed;

  console.log("Starting Factory benchmark for 100,000 logs...");
  const startTime = performance.now();

  const logCount = 100000;
  for (let i = 0; i < logCount; i++) {
    await logger.log({ message: `Log Message ${i}` });
  }
  await logger.close();

  const endTime = performance.now();
  const totalTime = endTime - startTime;
  const logsPerSecond = (logCount / totalTime) * 1000;
  const finalCpuUsage = process.cpuUsage(initialCpuUsage);
  const finalMemoryUsage = process.memoryUsage().heapUsed;
  const cpuTime = (finalCpuUsage.user + finalCpuUsage.system) / 1000;
  console.log(
    `Factory benchmark completed: ${logCount} logs in ${totalTime.toFixed(
      2
    )} ms`
  );
  await logger.close();
  console.log(`Logs per second: ${logsPerSecond.toFixed(2)} logs/sec`);
  const memoryUsed = (finalMemoryUsage - initialMemoryUsage) / 1024 / 1024;
  console.log(`Memory used: ${memoryUsed.toFixed(2)} MB`);
  console.log(`CPU time used: ${cpuTime.toFixed(2)} ms`);
}
benchmarkFactory();
