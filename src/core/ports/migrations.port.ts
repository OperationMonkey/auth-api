import type { Migration } from "../entities/migration";

export const MigrationsPort = Symbol("MigrationsPort");

export interface MigrationsPort {
  getAllMigrations(): Promise<Array<Migration>>;
  getIdsOfMigrated(): Promise<Array<string>>;
  up(id: string): Promise<boolean>;
  down(id: string): Promise<boolean>;
}
