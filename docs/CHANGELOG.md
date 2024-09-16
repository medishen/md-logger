# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2024-09-07

### Added

- Initial release of `@medishn/gland-logger`.
- Support for logging to both file and console.
- File rotation and buffering capabilities.
- End-to-end tests for `Factory` class.
- Unit tess for `ConsoleTransport` class and `FileTransport` class
- integration test for `Factory` class

### Fixed

- Resolved issues with file rotation and buffer flushing.

### Changed

- Improved performance and memory management for file logging.
# Changelog

All notable changes to this project will be documented in this file.

## [1.0.1] - 2024-09-07

### Added

- Suppoer typescript

## [1.0.2] - 2024-09-07

### Added

- Suppoer typescript with map
## [1.0.3] - 2024-09-07

### Fix

- The path of the original file has been corrected

## [1.0.4] - 2024-09-16

### Added
- the package comes with more modular codes and also with new features. In this feature, you have to select the content of the logger as {}, which has 4 options, 2 of which are mandatory, namely message and format. Also, the default level is info. And you don't need to specify it every time (unless you want something else).
- A new namespace called Argument was added, which contains the type of input arguments and all arguments are written in it.
- A new option is received as an input that you can specify the color of your logs in the console. Personalize.