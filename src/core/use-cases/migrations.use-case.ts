import { Inject, Injectable } from "@nestjs/common";

import type { Migration } from "../entities/migration";

import { MigrationsPort } from "../ports/migrations.port";

@Injectable()
export class MigrationsUseCase {
  constructor(@Inject(MigrationsPort) private readonly migrationsAdapter: MigrationsPort) {}

  public async runAllMigrations(): Promise<Array<Migration>> {
    const allMigrations = await this.migrationsAdapter.getAllMigrations();
    const allMigrated = await this.migrationsAdapter.getIdsOfMigrated();

    const allPending = allMigrations
      .filter((migration) => !allMigrated.includes(migration.id))
      .sort((a, b) => a.orderNumber - b.orderNumber);

    return allPending;
  }
}
