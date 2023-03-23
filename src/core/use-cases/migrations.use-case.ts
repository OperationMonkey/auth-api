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
   * @note prepare database and run migrations if table empty
   */
  public async onModuleInit(): Promise<void> {
    await this.migrationsAdapter.prepareDatabase();
    const migrated = await this.migrationsAdapter.getOrderNumbersOfMigrated();

    if (migrated.length === 0) {
      await this.runAllMigrations();
    }
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
      this.logger.error(
        `${MigrationsUseCase.name}::runSingleMigrationUp()::failed-to-run-migration::${orderNumber}`
      );
      throw error;
    }
  }

  public async runSingleMigrationDown(orderNumber: number): Promise<void> {
    try {
      await this.migrationsAdapter.down(orderNumber);
    } catch (error) {
      this.logger.error(
        `${MigrationsUseCase.name}::runSingleMigrationDown()::failed-to-run-migration::${orderNumber}`
      );
      throw error;
    }
  }
}
