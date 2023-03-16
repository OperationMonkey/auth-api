import type { OnModuleInit } from "@nestjs/common";
import { Inject, Injectable } from "@nestjs/common";

import type { Migration } from "../entities/migration";
import { LoggerPort } from "../ports/logger.port";
import { MigrationsPort } from "../ports/migrations.port";

@Injectable()
export class MigrationsUseCase implements OnModuleInit {
  public constructor(
    @Inject(LoggerPort) private readonly logger: LoggerPort,
    @Inject(MigrationsPort) private readonly migrationsAdapter: MigrationsPort
  ) {}

  /**
   * @todo if no migrations in database,
   *       run all available migrations
   */
  public onModuleInit(): void {
    console.log("will check if database is empty and run all migrations");
  }

  public async runAllMigrations(): Promise<Array<Migration>> {
    const allMigrations = await this.migrationsAdapter.getAllMigrations();
    const allMigrated = await this.migrationsAdapter.getIdsOfMigrated();

    const allPending = allMigrations
      .filter((migration) => !allMigrated.includes(migration.id))
      .sort((a, b) => a.orderNumber - b.orderNumber);

    this.logger.info(allPending);

    return allPending;
  }
}
