# Developer Guide

Welcome to the `@medishn/logger` developer guide. This document provides an overview of the development workflow, including setup, coding standards, and best practices.

## Setting Up the Development Environment

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/medishen/md-logger.git
   cd md-logger
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```

## Coding Standards

- **Code Style**: Follow the project's coding style guidelines.
- **Documentation**: Ensure all public methods and classes are well-documented.
- **Testing**: Write unit and end-to-end tests for all new features and bug fixes.

## Running Tests

To run tests, use the following command:

```bash
npm test
```

## Building the Project

To build the project, use:

```bash
npm run build
```

## Release Process

1. **Update Version**: Update the version in `package.json`.
2. **Changelog**: Update the [CHANGELOG.md](CHANGELOG.md) with the new version details.
3. **Tag Release**: Create a new git tag for the release.
   ```bash
   git tag -a vX.X.X -m "Release version X.X.X"
   git push origin vX.X.X
   ```
4. **Publish**: Publish the package to npm.
   ```bash
   npm publish
   ```

## Contact

For any questions or concerns, contact [bitsgenix@gmail.com](mailto:bitsgenix@gmail.com).
