import type { Migration } from "../../core/entities/migration";
import type { MigrationsPort } from "../../core/ports/migrations.port";
import { migrations } from "../../migrations";

export class MigrationsAdapter implements MigrationsPort {
  public getAllMigrations(): Promise<Migration[]> {
    return Promise.resolve(migrations);
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
