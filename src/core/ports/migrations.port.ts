import type { Migration } from "../entities/migration";

export const MigrationsPort = Symbol("MigrationsPort");

export interface MigrationsPort {
  listAllMigrations(): Promise<Array<Migration>>;
  listAllActive(): Promise<Array<Migration>>;
  listAllPending(): Promise<Array<Migration>>;
  up(): Promise<boolean>;
  down(): Promise<boolean>;
}
