import type { MigrationsPort } from "../../../src/core/ports/migrations.port";

export const MockMigrationsPort: MigrationsPort = {
  getAllMigrations: jest.fn(),
  getIdsOfMigrated: jest.fn(),
  up: jest.fn(),
  down: jest.fn(),
};
