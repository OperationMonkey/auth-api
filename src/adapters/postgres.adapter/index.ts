import { Inject, Injectable } from "@nestjs/common";

import { Pool } from "pg";

import { ConfigPort } from "../../core/ports/config.port";

import type { MigrationsPort } from "../../core/ports/migrations.port";

import { MigrationsAdapter } from "./migrations.adapter";

@Injectable()
export class PostgresAdapter extends MigrationsAdapter implements MigrationsPort {
  private readonly pool;

  public constructor(@Inject(ConfigPort) private readonly config: ConfigPort) {
    super();
    this.pool = new Pool({
      connectionString: this.config.databaseUrl,
    });
  }
}
