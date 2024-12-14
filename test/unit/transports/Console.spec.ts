import { describe, test } from 'node:test';
import { ConsoleTransport } from '../../../lib/transports/Console';
import { Colors } from '../../../lib/helper/Colors';
import { Log } from '../../../lib/helper/Format';

describe('Console Transprt', () => {
  let logColors = {
    info: Colors.GREEN,
    warn: Colors.YELLOW,
    error: Colors.RED,
    debug: Colors.BRIGHT_BLUE,
  };
  const formatter = new Log('locale');
  test('Info Log', () => {
    const original = console.log;
    let output: string[] = [];
    // Mock console.log without recursion
    const mockedLog = (message: string) => {
      output.push(message);
    };
    // Replace console.log with the mock
    console.log = mockedLog;
    const logger = new ConsoleTransport({ colors: logColors }, formatter);
    logger.log({
      message: 'info Loggin',
      category: 'App',
      level: 'info',
    });
    console.log = original;
  });
});
