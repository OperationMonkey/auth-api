import { Inject, Injectable } from "@nestjs/common";
import type { QueryResult } from "pg";
import { Pool } from "pg";

import { DatabaseException } from "../../core/exceptions/database.error";
import { ConfigPort } from "../../core/ports/config.port";
import type { DatabasePort } from "../../core/ports/database.port";

import { MigrationsAdapter } from "./migrations.adapter";
import { UsersAdapter } from "./users.adapter";

@Injectable()
export class PostgresAdapter implements DatabasePort {
  private readonly pool;
  public readonly migrations: MigrationsAdapter;
  public readonly users: UsersAdapter;

  public constructor(@Inject(ConfigPort) private readonly config: ConfigPort) {
    this.pool = new Pool({
      connectionString: this.config.databaseUrl,
    });
    this.migrations = new MigrationsAdapter(this);
    this.users = new UsersAdapter(this);
  }

  /**
   *
   * @param sql raw sql query
   * @param values values as an array for $1, $2, $3 etc. in the query
   * @returns {QueryResult} result on success
   * @throws {DatabaseException} on failure
   */
  public async __runQuery(sql: string, values: Array<unknown> = []): Promise<QueryResult> {
    try {
      const result = await this.pool.query(sql, values);

      return result;
    } catch {
      throw new DatabaseException("Failed to run query");
    }
  }
}
