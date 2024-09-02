import { Options } from '../../lib/types/index';
import { Factory } from '../../lib/logger/Factory';

// Configure logger options
const loggerOptions: Options = {
  level: "debug", // Log level: 'debug', 'info', 'warn', 'error'
  timestampFormat: "iso", // Timestamp format: 'iso' or 'locale'
  file: "app.log", // Log file name (will be saved in the logs/ directory)
};

// Create a logger using the Factory
const logger = Factory.create(loggerOptions);

// Log messages at various levels
logger.info("Application started successfully", "System");
logger.warn("Low disk space warning", "Storage");
logger.error(
  "Failed to connect to database",
  new Error("Connection refused"),
  "Database"
);
logger.debug("Debugging user session", "Auth");

// Shut down the logger gracefully after a delay
setTimeout(() => {
  logger.shutdown();
  console.log("Logger has been shut down.");
}, 5000); // Shutdown after 5 seconds
