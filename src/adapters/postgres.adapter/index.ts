import type { OnModuleInit } from "@nestjs/common";
import { Inject, Injectable } from "@nestjs/common";
import type { QueryResult } from "pg";
import { Pool } from "pg";
import { z } from "zod";

import type { Migration } from "../../core/entities/migration";
import { DatabaseException } from "../../core/exceptions/database.error";
import { MigrationException } from "../../core/exceptions/migration.error";
import { ConfigPort } from "../../core/ports/config.port";
import { LoggerPort } from "../../core/ports/logger.port";
import type { MigrationsPort } from "../../core/ports/migrations.port";

import { migrations } from "./migrations";

@Injectable()
export class PostgresAdapter implements OnModuleInit, MigrationsPort {
  private readonly pool;

  public constructor(
    @Inject(ConfigPort) private readonly config: ConfigPort,
    @Inject(LoggerPort) private readonly logger: LoggerPort
  ) {
    this.pool = new Pool({
      connectionString: this.config.databaseUrl,
    });
  }

  public async onModuleInit(): Promise<void> {
    await this.prepareDatabase();
  }

  /**
   * @interface MigrationsPort is implemented here
   */
  public getAllMigrations(): Promise<Migration[]> {
    return Promise.resolve(
      migrations.map((migration) => ({ name: migration.name, orderNumber: migration.orderNumber }))
    );
  }

  public async getOrderNumbersOfMigrated(): Promise<number[]> {
    const result = await this.runQuery("SELECT order_number FROM migrations");
    const schema = z.object({ order_number: z.number() });

    try {
      if (result) {
        return result.rows.map((row) => schema.parse(row).order_number);
      }
    } catch (error) {
      this.logger.error(
        `${PostgresAdapter.name}::getOrderNumbersOfMigrated::failed-to-parse-results`
      );
    }
    throw new DatabaseException("Failed to fetch orderNumbers of migrated");
  }

  public async up(orderNumber: number): Promise<boolean> {
    const migration = migrations.find((migration) => migration.orderNumber === orderNumber);

    if (!migration) {
      throw new MigrationException(`could not find migration with number ${orderNumber}`);
    }
    const result = await this.runQuery(migration.up);

    if (result) {
      return true;
    }

    return false;
  }

  public async down(orderNumber: number): Promise<boolean> {
    const migration = migrations.find((migration) => migration.orderNumber === orderNumber);

    if (!migration) {
      throw new MigrationException(`could not find migration with number ${orderNumber}`);
    }
    const result = await this.runQuery(migration.down);

    if (result) {
      return true;
    }

    return false;
  }

  /**
   *
   * @throws DatabaseException on failure
   * @returns true on success
   */
  private async prepareDatabase(): Promise<boolean> {
    const result = await this.runQuery(
      "CREATE TABLE IF NOT EXISTS migrations (\
        id VARCHAR(50) PRIMARY KEY,\
        name VARCHAR(100) UNIQUE NOT NULL,\
        order_number UNIQUE INT NOT NULL,\
        created_on TIMESTAMP NOT NULL DEFAULT current_timestamp\
        );"
    );

    if (!result) {
      throw new DatabaseException("Error preparing migrations table");
    }

    return true;
  }

  /**
   *
   * @param sql raw sql query
   * @param values values as an array for $1, $2, $3 etc. in the query
   * @returns {QueryResult | undefined} result on success - undefined on failure
   */
  private async runQuery(sql: string, values?: Array<unknown>): Promise<QueryResult | undefined> {
    try {
      const result = this.pool.query(sql, values);

      return await result;
    } catch {
      return;
    }
  }
}
