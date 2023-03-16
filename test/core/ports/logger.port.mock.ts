import type { LoggerPort } from "../../../src/core/ports/logger.port";

export const MockLoggerPort: LoggerPort = {
  debug: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
};
