import type { MigrationsPort } from "./migrations.port";

/**
 * @todo this needs to be revisited and mocks should probably be under /test
 */
export class MockMigrationsPort implements MigrationsPort {
  getAllMigrations = jest.fn();
  getIdsOfMigrated = jest.fn();
  up = jest.fn();
  down = jest.fn();
}
