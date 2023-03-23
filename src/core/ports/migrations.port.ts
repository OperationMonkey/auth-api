import type { Migration } from "../entities/migration";

export const MigrationsPort = Symbol("MigrationsPort");

export interface MigrationsPort {
  prepareDatabase(): Promise<void>;
  getAllMigrations(): Promise<Array<Migration>>;
  getOrderNumbersOfMigrated(): Promise<Array<number>>;
  up(orderNumber: number): Promise<boolean>;
  down(orderNumber: number): Promise<boolean>;
}
