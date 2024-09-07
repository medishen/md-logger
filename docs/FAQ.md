# Frequently Asked Questions (FAQ)

## What is `@medishn/gland-logger`?

`@medishn/gland-logger` is a logging library for Node.js that provides flexible logging to both file and console with support for file rotation and buffering.

## How do I install `@medishn/gland-logger`?

You can install it via npm:

```bash
npm install @medishn/gland-logger
```

## How do I configure the logger?

You can configure the logger by passing options to the `Factory` class. For example:

```typescript
import { Factory } from "@medishn/gland-logger";

const options = {
  level: "info",
  transports: ["file"],
  file: "combined.log",
  rotation: {
    maxSize: 1024 * 1024, // 1 MB
  },
};

const logger = new Factory(options);
```

## What are the supported log levels?

`@medishn/gland-logger` supports the following log levels:

- `info`
- `warn`
- `error`
- `debug`

## How does file rotation work?

The library supports file rotation by creating a new log file when the current file reaches a specified maximum size. Old log files are renamed with an index to keep them organized.

## How can I contribute to the project?

Please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to contribute to `@medishn/gland-logger`.

## How do I report a security vulnerability?

If you discover a security vulnerability, please report it to [bitsgenix@gmail.com](mailto:bitsgenix@gmail.com) with details of the issue.

## Where can I find more information?

For more information, check out the [README.md](../README.md) file or contact us at [bitsgenix@gmail.com](mailto:bitsgenix@gmail.com).
