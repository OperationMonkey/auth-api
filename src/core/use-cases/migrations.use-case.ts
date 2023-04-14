import type { OnModuleInit } from "@nestjs/common";
import { Inject, Injectable } from "@nestjs/common";

import type { Migration } from "../entities/migration";
import { DatabasePort } from "../ports/database.port";
import { LoggerPort } from "../ports/logger.port";

@Injectable()
export class MigrationsUseCase implements OnModuleInit {
  public constructor(
    @Inject(LoggerPort) private readonly logger: LoggerPort,
    @Inject(DatabasePort) private readonly databaseAdapter: DatabasePort
  ) {}

  /**
   * @note prepare database and run migrations if table empty
   */
  public async onModuleInit(): Promise<void> {
    await this.databaseAdapter.migrations.prepareDatabase();
    const migrated = await this.databaseAdapter.migrations.getOrderNumbersOfMigrated();

    if (migrated.length === 0) {
      await this.runAllMigrations();
    }
  }

  public async getAllMigrations(): Promise<Array<Migration>> {
    const migrations = await this.databaseAdapter.migrations.getAllMigrations();

    return migrations;
  }

  public async getAllPendingMigrations(): Promise<Array<Migration>> {
    const allMigrations = await this.databaseAdapter.migrations.getAllMigrations();
    const allMigrated = await this.databaseAdapter.migrations.getOrderNumbersOfMigrated();

    const allPending = allMigrations
      .filter((migration) => !allMigrated.includes(migration.orderNumber))
      .sort((a, b) => a.orderNumber - b.orderNumber);

    return allPending;
  }

  public async runAllMigrations(): Promise<void> {
    const allPending = await this.getAllPendingMigrations();

    // eslint-disable-next-line fp/no-loops
    for await (const migration of allPending) {
      await this.runMigrationUpByOrderNumber(migration.orderNumber);
    }
  }

  public async runSingleMigrationUp(): Promise<void> {
    const nextMigration = await this.findNextMigration();

    if (!nextMigration) {
      return;
    }

    await this.runMigrationUpByOrderNumber(nextMigration.orderNumber);
  }

  public async runSingleMigrationDown(): Promise<void> {
    const lastMigration = await this.findLastMigration();

    if (!lastMigration) {
      return;
    }

    await this.runMigrationDownByOrderNumber(lastMigration);
  }

  private async runMigrationUpByOrderNumber(orderNumber: number): Promise<void> {
    try {
      await this.databaseAdapter.migrations.up(orderNumber);
    } catch (error) {
      this.logger.error(
        `${MigrationsUseCase.name}::runSingleMigrationUp()::failed-to-run-migration::${orderNumber}`
      );
      throw error;
    }
  }

  private async runMigrationDownByOrderNumber(orderNumber: number): Promise<void> {
    try {
      await this.databaseAdapter.migrations.down(orderNumber);
    } catch (error) {
      this.logger.error(
        `${MigrationsUseCase.name}::runSingleMigrationDown()::failed-to-run-migration::${orderNumber}`
      );
      throw error;
    }
  }

  private async findNextMigration(): Promise<Migration | undefined> {
    try {
      const migrations = await this.getAllPendingMigrations();

      if (!migrations[0]) {
        return undefined;
      }

      return migrations.reduce((prev, curr) => {
        return prev.orderNumber > curr.orderNumber ? curr : prev;
      }, migrations[0]);
    } catch (error) {
      this.logger.error(
        `${MigrationsUseCase.name}::findNextMigration()::error-getting-all-pending`
      );

      return undefined;
    }
  }

  private async findLastMigration(): Promise<number | undefined> {
    try {
      const migrations = await this.databaseAdapter.migrations.getOrderNumbersOfMigrated();

      if (!migrations[0]) {
        return undefined;
      }

      return migrations.reduce((prev, curr) => Math.max(prev, curr), migrations[0]);
    } catch (error) {
      this.logger.error(
        `${MigrationsUseCase.name}::findLastMigration()::error-getting-numbers-of-migrated`
      );

      return undefined;
    }
  }
}
