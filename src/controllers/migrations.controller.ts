import { Controller, Get, HttpCode, Inject } from "@nestjs/common";

import type { Migration } from "../core/entities/migration";
import { MigrationsUseCase } from "../core/use-cases/migrations.use-case";

@Controller({
  path: "migrations",
  version: "1",
})
export class MigrationControllerV1 {
  public constructor(
    @Inject(MigrationsUseCase) private readonly migrationUseCase: MigrationsUseCase
  ) {}

  @Get()
  @HttpCode(200)
  public async findAll(): Promise<Array<Migration>> {
    const migrations = await this.migrationUseCase.getAllMigrations();

    return migrations;
  }

  @Get("/pending")
  @HttpCode(200)
  public async findAllPending(): Promise<Array<Migration>> {
    const migrations = await this.migrationUseCase.getAllPendingMigrations();

    return migrations;
  }
}
