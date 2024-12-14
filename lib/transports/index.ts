import { Arguments } from '../types/args';
export abstract class Transport {
  abstract log(args: Arguments.Format): void | Promise<void>;
  abstract close?(): Promise<void>;
}
