import { Inject, Injectable } from "@nestjs/common";
import { Pool } from "pg";

import type { Migration } from "../../core/entities/migration";
import { ConfigPort } from "../../core/ports/config.port";
import type { MigrationsPort } from "../../core/ports/migrations.port";

import { migrations } from "./migrations";

@Injectable()
export class PostgresAdapter implements MigrationsPort {
  private readonly pool;

  public constructor(@Inject(ConfigPort) private readonly config: ConfigPort) {
    this.pool = new Pool({
      connectionString: this.config.databaseUrl,
    });
  }

  /**
   * @interface MigrationsPort is implemented here
   */
  public getAllMigrations(): Promise<Migration[]> {
    return Promise.resolve(
      migrations.map((migration) => ({ name: migration.name, orderNumber: migration.orderNumber }))
    );
  }

  public getOrderNumbersOfMigrated(): Promise<number[]> {
    throw new Error("Method not implemented.");
  }

  public up(_id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  public down(_id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
