export const LoggerPort = Symbol("LoggerPort");

export interface LoggerPort {
  debug(...params: Array<unknown>): void;
  info(...params: Array<unknown>): void;
  error(...params: Array<unknown>): void;
}
