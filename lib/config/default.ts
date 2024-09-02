import { Options } from "../types";

const defaultConfig: Options = {
  level: "info",
  jsonFormat: false,
  timestampFormat: "iso",
  rotation: {
    enabled: false,
    maxSize: 10485760,
    maxFiles: 5,
  },
  errorHandling: {
    file: "error.log",
    console: true,
  },
  transports: ["console", "file"],
};

export default defaultConfig;
