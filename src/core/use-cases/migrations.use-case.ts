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
  public async onModuleInit(): Promise<void> {
    this.logger.info("will check if database is empty and run all migrations");
    await Promise.resolve();
  }

  public async runAllMigrations(): Promise<Array<Migration>> {
    const allMigrations = await this.migrationsAdapter.getAllMigrations();
    const allMigrated = await this.migrationsAdapter.getOrderNumbersOfMigrated();

    const allPending = allMigrations
      .filter((migration) => !allMigrated.includes(migration.orderNumber))
      .sort((a, b) => a.orderNumber - b.orderNumber);

    this.logger.info(allPending);

    return allPending;
  }
}
