import type { OnModuleInit } from "@nestjs/common";
import { Inject, Injectable } from "@nestjs/common";

import type { Migration } from "../entities/migration";

import { MigrationException } from "../exceptions/migration.error";
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
    await this.runAllMigrations();
  }

  public async getAllMigrations(): Promise<Array<Migration>> {
    return this.migrationsAdapter.getAllMigrations();
  }

  public async getAllPendingMigrations(): Promise<Array<Migration>> {
    const allMigrations = await this.migrationsAdapter.getAllMigrations();
    const allMigrated = await this.migrationsAdapter.getOrderNumbersOfMigrated();

    const allPending = allMigrations
      .filter((migration) => !allMigrated.includes(migration.orderNumber))
      .sort((a, b) => a.orderNumber - b.orderNumber);

    return allPending;
  }

  public async runAllMigrations(): Promise<void> {
    const allPending = await this.getAllPendingMigrations();

    // eslint-disable-next-line fp/no-loops
    for await (const migration of allPending) {
      await this.runSingleMigrationUp(migration.orderNumber);
    }
  }

  public async runSingleMigrationUp(orderNumber: number): Promise<void> {
    try {
      await this.migrationsAdapter.up(orderNumber);
    } catch (error) {
      if (error instanceof MigrationException) {
        this.logger.error(
          `${MigrationsUseCase.name}::runAllMigrations()::failed-to-run-migration::${orderNumber}`
        );
        throw error;
      }
      this.logger.error(
        `${MigrationsUseCase.name}::runAllMigrations()::unknown-error::${orderNumber}`
      );
      throw error;
    }
  }
}
