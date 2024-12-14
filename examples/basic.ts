import { Logger } from "../lib/index";
function main() {
  const logger = new Logger({ format: "locale", transports: ["console"] });
  logger.log({ message: "info", level: "info", category: "MAIN" });
  logger.log({ message: "debug", level: "debug", category: "MAIN" });
  logger.log({ message: "error", level: "error", category: "MAIN" });
  logger.log({ message: "warn", level: "warn", category: "MAIN" });
}
main();
