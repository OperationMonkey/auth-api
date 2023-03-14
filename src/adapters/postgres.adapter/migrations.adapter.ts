import type { Migration } from "../../core/entities/migration";
import type { MigrationsPort } from "../../core/ports/migrations.port";

export class MigrationsAdapter implements MigrationsPort {
  listAllMigrations(): Promise<Migration[]> {
    throw new Error("Method not implemented.");
  }
  listAllActive(): Promise<Migration[]> {
    throw new Error("Method not implemented.");
  }
  listAllPending(): Promise<Migration[]> {
    throw new Error("Method not implemented.");
  }
  up(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  down(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
