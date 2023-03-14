import type { Migration } from "../../core/entities/migration";
import type { MigrationsPort } from "../../core/ports/migrations.port";

export class MigrationsAdapter implements MigrationsPort {
  getAllMigrations(): Promise<Migration[]> {
    throw new Error("Method not implemented.");
  }
  getIdsOfMigrated(): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  up(_id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  down(_id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
