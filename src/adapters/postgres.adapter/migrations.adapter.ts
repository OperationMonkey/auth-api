import * as Crypto from "crypto";

import { z } from "zod";

import type { Migration } from "../../core/entities/migration";
import { DatabaseException } from "../../core/exceptions/database.error";
import { MigrationException } from "../../core/exceptions/migration.error";
import type { MigrationsPort } from "../../core/ports/database.port";

import { objectHasKey } from "../../utils/validate-object";

import { migrations } from "./migrations";

import type { PostgresAdapter } from ".";

/**
 * @interface MigrationsPort is implemented here
 */
export class MigrationsAdapter implements MigrationsPort {
  private readonly postgresAdapter: PostgresAdapter;

  public constructor(postgresAdapter: PostgresAdapter) {
    this.postgresAdapter = postgresAdapter;
  }

  public getAllMigrations(): Promise<Migration[]> {
    return Promise.resolve(
      migrations.map((migration) => ({ name: migration.name, orderNumber: migration.orderNumber }))
    );
  }

  public async getOrderNumbersOfMigrated(): Promise<number[]> {
    /**
     * @note this.runQuery throws DatabaseException on failure, we can pass it to Core
     */
    const result = await this.postgresAdapter.__runQuery("SELECT order_number FROM migrations");
    const schema = z.object({ order_number: z.coerce.number() });

    try {
      return result.rows.map((row) => schema.parse(row).order_number);
    } catch (error) {
      throw new DatabaseException("Failed to parse data from database");
    }
  }

  public async up(orderNumber: number): Promise<boolean> {
    try {
      const migration = migrations.find((migration) => migration.orderNumber === orderNumber);

      if (!migration) {
        throw new MigrationException(`could not find migration with number ${orderNumber}`);
      }
      await this.postgresAdapter.__runQuery("BEGIN");
      await this.postgresAdapter.__runQuery(migration.up);
      await this.postgresAdapter.__runQuery(
        "INSERT INTO migrations(id, name, order_number) VALUES($1,$2,$3)",
        [Crypto.randomUUID(), migration.name, migration.orderNumber]
      );
      await this.postgresAdapter.__runQuery("COMMIT");
    } catch (error) {
      await this.postgresAdapter.__runQuery("ROLLBACK");
      throw new DatabaseException("Failed to run migration up");
    }

    return true;
  }

  public async down(orderNumber: number): Promise<boolean> {
    const migration = migrations.find((migration) => migration.orderNumber === orderNumber);

    if (!migration) {
      throw new MigrationException(`could not find migration with number ${orderNumber}`);
    }
    try {
      const result = await this.postgresAdapter.__runQuery(
        "SELECT id, order_number FROM migrations WHERE order_number = $1",
        [orderNumber]
      );

      /**
       * @note this could be put in a helper called 'resultHasId()' to be more readable
       */
      if (
        !result.rows[0] ||
        typeof result.rows[0] === "object" ||
        !objectHasKey(result.rows[0], "id")
      ) {
        throw new DatabaseException("No such migration found from database");
      }
      const id = result.rows[0]["id"];

      await this.postgresAdapter.__runQuery("BEGIN");
      await this.postgresAdapter.__runQuery(migration.down);
      await this.postgresAdapter.__runQuery("DELETE FROM migrations WHERE id = $1", [id]);
      await this.postgresAdapter.__runQuery("COMMIT");
    } catch (error) {
      await this.postgresAdapter.__runQuery("ROLLBACK");
      throw new DatabaseException("Failed to run migration down");
    }

    return true;
  }

  /**
   *
   * @throws DatabaseException on failure
   * @returns true on success
   */
  public async prepareDatabase(): Promise<void> {
    try {
      await this.postgresAdapter.__runQuery(
        "CREATE TABLE IF NOT EXISTS migrations (\
        id VARCHAR(50) PRIMARY KEY,\
        name VARCHAR(100) UNIQUE NOT NULL,\
        order_number BIGSERIAL NOT NULL,\
        created_on TIMESTAMP NOT NULL DEFAULT current_timestamp\
        );"
      );
    } catch {
      throw new DatabaseException("Error preparing migrations table");
    }
  }
}
