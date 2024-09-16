import { Colors } from "../helper/Colors";

export namespace Default {
  export const colors = {
    info: Colors.MAIN().green,
    warn: Colors.MAIN().yellow,
    error: Colors.MAIN().red,
    debug: Colors.MAIN().brightBlue,
  };
  export const ConfigFiles = {
    maxSize: 1024 * 1024,
    bufferSize: 1024,
    autoFlushInterval: 1000,
    colors: {
      info: Colors.MAIN().green,
      warn: Colors.MAIN().yellow,
      error: Colors.MAIN().red,
      debug: Colors.MAIN().brightBlue,
    },
    logFilePath: "logs/app.log",
    maxFiles: Infinity,
  };
}
