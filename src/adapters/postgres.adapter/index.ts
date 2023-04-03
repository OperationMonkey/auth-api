/**
 * @todo remove this lint disable once methods implemented
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Crypto from "crypto";

import { Inject, Injectable } from "@nestjs/common";
import type { QueryResult } from "pg";
import { Pool } from "pg";
import { z } from "zod";

import type { Migration } from "../../core/entities/migration";
import type { User } from "../../core/entities/user";
import { DatabaseException } from "../../core/exceptions/database.error";
import { MigrationException } from "../../core/exceptions/migration.error";
import { ConfigPort } from "../../core/ports/config.port";
import { LoggerPort } from "../../core/ports/logger.port";
import type { MigrationsPort } from "../../core/ports/migrations.port";
import type { UsersPort } from "../../core/ports/users.port";
import { ValidatorPort } from "../../core/ports/validator.port";

import { migrations } from "./migrations";

@Injectable()
export class PostgresAdapter implements MigrationsPort, UsersPort {
  private readonly pool;

  public constructor(
    @Inject(ConfigPort) private readonly config: ConfigPort,
    @Inject(LoggerPort) private readonly logger: LoggerPort,
    @Inject(ValidatorPort) private readonly validator: ValidatorPort
  ) {
    this.pool = new Pool({
      connectionString: this.config.databaseUrl,
    });
  }

  /**
   * @interface UsersPort is implemented here
   */
  public async addUser(
    username: string,
    password: string,
    name: string,
    email: string
  ): Promise<User> {
    try {
      const sql =
        "INSERT INTO accounts(id, username, password, name, email) \
                   VALUES($1,$2,$3,$4,$5) RETURNING id, username, name, email, \
                   admin, locked, deleted, created_on, modified_on";
      const values = [Crypto.randomUUID(), username, password, name, email];
      const result = await this.runQuery(sql, values);

      if (this.validator.isValidUser(result.rows[0])) {
        return {
          id: result.rows[0].id,
          username: result.rows[0].username,
          name: result.rows[0].name,
          email: result.rows[0].email,
          admin: result.rows[0].admin,
          locked: result.rows[0].locked,
          deleted: result.rows[0].deleted,
          createdOn: result.rows[0].created_on,
          modifiedOn: result.rows[0].modified_on,
        };
      } else {
        throw new DatabaseException("invalid query result");
      }
    } catch (error) {
      if (error instanceof DatabaseException) {
        throw error;
      } else {
        throw new DatabaseException("Query gave incorrect result");
      }
    }
  }

  public updateUser(
    id: string,
    username: string,
    password: string,
    name: string,
    email: string
  ): Promise<User> {
    throw new Error("Method not implemented.");
  }

  public updatePassword(id: string, password: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public findUserById(id: string): Promise<User> {
    throw new Error("Method not implemented.");
  }

  public findUserByUsername(username: string): Promise<User> {
    throw new Error("Method not implemented.");
  }

  public deleteUser(id: string): Promise<void> {
    throw new Error("Method not implemented.");
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
    /**
     * @note this.runQuery throws DatabaseException on failure, we can pass it to Core
     */
    const result = await this.runQuery("SELECT order_number FROM migrations");
    const schema = z.object({ order_number: z.coerce.number() });

    try {
      return result.rows.map((row) => schema.parse(row).order_number);
    } catch (error) {
      this.logger.error(
        `${PostgresAdapter.name}::getOrderNumbersOfMigrated::failed-to-parse-results`
      );
      throw new DatabaseException("Failed to parse data from database");
    }
  }

  public async up(orderNumber: number): Promise<boolean> {
    try {
      const migration = migrations.find((migration) => migration.orderNumber === orderNumber);

      if (!migration) {
        throw new MigrationException(`could not find migration with number ${orderNumber}`);
      }
      await this.runQuery("BEGIN");
      await this.runQuery(migration.up);
      await this.runQuery("INSERT INTO migrations(id, name, order_number) VALUES($1,$2,$3)", [
        Crypto.randomUUID(),
        migration.name,
        migration.orderNumber,
      ]);
      await this.runQuery("COMMIT");
    } catch (error) {
      await this.runQuery("ROLLBACK");
      throw error;
    }

    return true;
  }

  public async down(orderNumber: number): Promise<boolean> {
    const migration = migrations.find((migration) => migration.orderNumber === orderNumber);

    if (!migration) {
      throw new MigrationException(`could not find migration with number ${orderNumber}`);
    }
    await this.runQuery(migration.down);

    return true;
  }

  /**
   *
   * @throws DatabaseException on failure
   * @returns true on success
   */
  public async prepareDatabase(): Promise<void> {
    try {
      await this.runQuery(
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

  /**
   *
   * @param sql raw sql query
   * @param values values as an array for $1, $2, $3 etc. in the query
   * @returns {QueryResult} result on success
   * @throws {DatabaseException} on failure
   */
  private async runQuery(sql: string, values: Array<unknown> = []): Promise<QueryResult> {
    try {
      const result = await this.pool.query(sql, values);

      return result;
    } catch {
      throw new DatabaseException("Failed to run query");
    }
  }
}
