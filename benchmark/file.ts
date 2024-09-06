import { performance } from "perf_hooks";
import { FileTransport } from "../lib/transports/File";

const logFilePath = "./logs/test.log";

// Benchmark for FileTransport logging 100,000 messages
async function benchmarkFileTransport() {
  const fileTransport = new FileTransport(logFilePath, {
    maxSize: 1024 * 1024, // 1 MB
    bufferSize: 1024, // 1 KB
    autoFlushInterval: 500, // 500ms
  });

  console.log("Starting FileTransport benchmark for 100,000 logs...");
  const startTime = performance.now();

  for (let i = 0; i < 100000; i++) {
    await fileTransport.log(`Log Message ${i}`, "info", "Benchmark");
  }

  const endTime = performance.now();
  const totalTime = endTime - startTime;

  console.log(
    `FileTransport benchmark completed: 100,000 logs in ${totalTime} ms`
  );

  // Ensure all remaining logs are flushed and file stream is closed
  await fileTransport.close();
}

benchmarkFileTransport();