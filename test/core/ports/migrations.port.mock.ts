import type { MigrationsPort } from "../../../src/core/ports/migrations.port";

export const MockMigrationsPort: MigrationsPort = {
  prepareDatabase: jest.fn(),
  getAllMigrations: jest.fn(),
  getOrderNumbersOfMigrated: jest.fn(),
  up: jest.fn(),
  down: jest.fn(),
};
