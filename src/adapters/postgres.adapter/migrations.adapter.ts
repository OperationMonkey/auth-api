import type { Migration } from "../../core/entities/migration";
import type { MigrationsPort } from "../../core/ports/migrations.port";

export class MigrationsAdapter implements MigrationsPort {
  public getAllMigrations(): Promise<Migration[]> {
    throw new Error("Method not implemented.");
  }
  public getIdsOfMigrated(): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  public up(_id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  public down(_id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
