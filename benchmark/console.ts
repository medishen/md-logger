import { performance } from "perf_hooks";
import { ConsoleTransport } from "../lib/transports/Console";
import { Colors } from "../lib/helper";
const logColors = {
  info: Colors.MAIN().green,
  warn: Colors.MAIN().yellow,
  error: Colors.MAIN().red,
  debug: Colors.MAIN().brightBlue,
};

// Benchmark for ConsoleTransport logging 100,000 messages
function benchmarkConsoleTransport() {
  const consoleTransport = new ConsoleTransport(logColors);

  console.log("Starting ConsoleTransport benchmark for 100,000 logs...");
  const startTime = performance.now();

  for (let i = 0; i < 100000; i++) {
    consoleTransport.log(`Log Message ${i}`, "info", "Benchmark");
  }

  const endTime = performance.now();
  const totalTime = endTime - startTime;

  console.log(
    `ConsoleTransport benchmark completed: 100,000 logs in ${totalTime} ms`
  );
}

benchmarkConsoleTransport();
