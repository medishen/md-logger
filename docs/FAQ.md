# FAQ for @medishn/gland-logger

### 1. **What are the required arguments for logging?**

When calling the `log` method, you must provide at least a `message`. The log level defaults to `info` if not provided.

```typescript
logger.log({
  message: "This is a log message",
});
```

### 2. **How do I customize the colors of log levels in the console?**

You can specify custom colors for each log level by passing the `console` option in the `Logger` constructor. Use ANSI color codes to define the colors.

```typescript
const logger = new Logger({
  transports: ["console"],
  console: {
    colors: {
      info: "\x1b[32m", // green
      warn: "\x1b[33m", // yellow
      error: "\x1b[31m", // red
      debug: "\x1b[34m", // blue
    },
  },
});
```

### 3. **How does file rotation work?**

File rotation is based on the size of the log file. You can specify a maximum file size, and once the file reaches that size, a new file will be created.

```typescript
const logger = new Logger({
  transports: ["file"],
  file: "app.log",
  rotation: { maxSize: 1024 * 1024 }, // 1MB
});
```

### 4. **Can I log to both console and file at the same time?**

Yes, you can log to both transports by specifying them in the `transports` array.

```typescript
const logger = new Logger({
  transports: ["console", "file"],
  file: "app.log",
});
```

### 5. **What happens if I don’t specify a log level?**

If you don’t specify a log level, the logger defaults to the `info` level.

```typescript
logger.log({
  message: "This is an info log", // Defaults to info
});
```

### 6. **Can I use the logger for different categories of logs?**

Yes, you can specify a `category` when logging to differentiate between types of logs.

```typescript
logger.log({
  message: "Database connection established",
  category: "DB",
  level: "info",
});
```

### 7. **How do I close the logger and flush remaining logs?**

If you are logging to a file, you can call the `close()` method to ensure that all buffered logs are flushed and the file is properly closed.

```typescript
await logger.close();
```