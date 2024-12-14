import assert from 'node:assert';
import { afterEach, beforeEach, describe, test } from 'node:test';
import { Logger } from '../../lib/';
import * as fs from 'fs';
import path from 'node:path';
const logFilePath = path.resolve(__dirname, '../../logs/app.log');
describe('MAIN LOGGER', () => {
  let logger: Logger;

  beforeEach(() => {
    // Initialize the factory and logger before each test
    logger = new Logger({
      file: 'app.log',
      transports: ['console', 'file'],
      format: 'locale',
    });
  });
  afterEach(async () => {
    // Close factory and clean up files after each test
    await logger.close();
    try {
      if (await fs.promises.stat(logFilePath)) {
        await fs.promises.unlink(logFilePath);
      }
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error('Error removing log file:', err);
      }
    }
  });
  test('Logger should be initialized with correct transports', () => {
    assert.strictEqual(logger['consoleTransport'] !== undefined, true);
    assert.strictEqual(logger['fileTransport'] !== undefined, true);
  });
  test('Logger should log messages to console', () => {
    // Capture console output
    const originalConsoleLog = console.log;
    let consoleOutput = '';
    console.log = (message: string) => {
      consoleOutput += message;
    };

    logger.log({ message: 'hi bro', level: 'info' });

    // Allow some time for logging to occur
    setImmediate(() => {
      console.log = originalConsoleLog; // Restore original console.log
      assert(consoleOutput.includes('hi bro'));
    });
  });
});
