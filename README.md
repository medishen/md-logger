# Medishn-logger

A customizable and modular logger designed for both console and file-based logging with support for file rotation, buffering, color personalization, and modular transport handling.

## Features

- **Console and File Logging**: Log messages to both console and file with custom formats.
- **File Rotation**: Automatically rotate log files based on size.
- **Buffering**: Buffer logs and flush them at intervals or when reaching a buffer size.
- **Color Personalization**: Customize log message colors for better console readability.
- **Modular Transports**: Easily configure and extend logging transports (console, file).
- **Customizable Log Levels**: Use predefined log levels (`info`, `warn`, `error`, `debug`) or set your own.
- **Default Levels**: The default log level is `info` if not specified.

## Installation

```bash
npm install @medishn/logger
```

## Usage

### Basic Setup

```typescript
import { Logger } from '@medishn/logger';

const logger = new Logger({
  transports: ['console', 'file'],
  file: 'app.log',
});

logger.log({
  message: 'Application started',
  level: 'info',
  category: 'APP',
});
```

### Customizing Log Colors

You can personalize console log colors for each log level.

```typescript
const logger = new Logger({
  transports: ['console'],
  console: {
    colors: {
      info: '\x1b[32m', // green
      warn: '\x1b[33m', // yellow
      error: '\x1b[31m', // red
      debug: '\x1b[34m', // blue
    },
  },
});

logger.log({ message: 'Server started', level: 'info' });
```

### File Rotation and Buffering

You can specify file rotation settings, such as maximum file size, and buffer log entries to be flushed at regular intervals.

```typescript
const logger = new Logger({
  transports: ['file'],
  file: 'app.log',
  rotation: { maxSize: 1024 * 1024 }, // 1MB file size before rotating
});

logger.log({ message: 'Logging to file with rotation', level: 'debug' });
```

## API

### Logger Class

- **Constructor**:
  - `opts: Options`
    - `transports: Array<"console" | "file">`: Specifies where to log (console, file, or both).
    - `file?: string`: The path for the log file.
    - `format?: "iso" | "locale"`: Log date format (default is `"iso"`).
    - `rotation?: { maxSize: number }`: File rotation settings.
    - `console?: { colors: Record<LogLevel, string> }`: Custom console log colors.
- **Methods**:
  - `log(args: Arguments.Log)`: Log a message.
  - `close()`: Closes the file transport and flushes any remaining logs.

## License

This project is licensed under the MIT License.
