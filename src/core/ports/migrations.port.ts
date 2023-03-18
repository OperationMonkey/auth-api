import type { Migration } from "../entities/migration";

export const MigrationsPort = Symbol("MigrationsPort");

export interface MigrationsPort {
  getAllMigrations(): Promise<Array<Migration>>;
  getOrderNumbersOfMigrated(): Promise<Array<number>>;
  up(id: string): Promise<boolean>;
  down(id: string): Promise<boolean>;
}
