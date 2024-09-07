# gland-logger

`gland-logger` is a flexible and efficient logging library for Node.js that provides logging capabilities to both files and the console. It supports file rotation, buffering, and customizable log levels, making it suitable for a wide range of applications.

## Features

- **File and Console Logging**: Log messages to files and console with color-coded output.
- **File Rotation**: Automatically rotate log files based on size.
- **Buffering**: Accumulate log messages in a buffer before writing to the file for efficiency.
- **Customizable Log Levels**: Supports different log levels including info, warn, error, and debug.
- **Auto-Flush**: Periodically flushes buffered logs to the file.

## Installation

You can install `@medishen/gland-logger` via npm:

```bash
npm install @medishen/gland-logger
```

## Usage

### Basic Configuration

To use the logger, you need to configure it using the `Factory` class. Here's a basic example:

```typescript
import { Factory } from '@medishen/gland-logger';

const options = {
  level: 'info',
  transports: ['file', 'console'],
  file: 'combined.log', // logs/combined.log
  rotation: {
    maxSize: 1024 * 1024, // 1 MB
  },
};

const logger = new Factory(options);

logger.info('This is an info message');
logger.warn('This is a warning message');
logger.error('This is an error message');
```

### File Rotation

The logger supports file rotation to manage log file sizes. You can configure the maximum size of the log file:

```typescript
const options = {
  file: 'combined.log',
  rotation: {
    maxSize: 1024 * 1024, // 1 MB
  },
};
```

When the log file reaches the specified size, it will be rotated, and a new log file will be created.

### Console Logging

To log messages to the console with color-coded output, include the `console` transport:

```typescript
const options = {
  transports: ['console'],
  colors: {
    info: '\x1b[32m', // Green
    warn: '\x1b[33m', // Yellow
    error: '\x1b[31m', // Red
    debug: '\x1b[34m', // Blue
  },
};
```

## Configuration Options

- **`level`**: The log level to use (`info`, `warn`, `error`, `debug`).
- **`transports`**: Array of transport methods (`file`, `console`).
- **`file`**: Path to the log file.
- **`rotation`**: Configuration for file rotation:
  - **`maxSize`**: Maximum size of the log file before rotation (in bytes).
- **`colors`**: Object defining colors for different log levels (console transport only).

## Running Tests

To run tests, use the following command:

```bash
npm test
```

## Contributing

We welcome contributions to `@medishen/gland-logger`. Please follow the guidelines in the [CONTRIBUTING.md](docs/CONTRIBUTING.md) file for details on how to contribute.

## Code of Conduct

Please review our [Code of Conduct](docs/CODE_OF_CONDUCT.md) to ensure a positive and respectful environment for everyone involved in the project.

## Security

If you discover a security vulnerability, please report it to us as outlined in [SECURITY.md](docs/SECURITY.md).

## Changelog

For a list of changes, improvements, and fixes, please refer to the [CHANGELOG.md](docs/CHANGELOG.md).

## FAQ

For frequently asked questions and their answers, visit [FAQ.md](docs/FAQ.md).

## Developer Guide

For detailed information on setting up and contributing to the project, refer to the [developer-guide.md](docs/developer-guide.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please reach out to us at [bitsgenix@gmail.com](mailto:bitsgenix@gmail.com).
