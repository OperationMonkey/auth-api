import { Controller, Get, HttpCode, Inject } from "@nestjs/common";

import type { Migration } from "../core/entities/migration";
import { MigrationsUseCase } from "../core/use-cases/migrations.use-case";

/**
 * @todo think if we should define version in function level
 */
/*
@Controller({
  path: "migrations",
  version: "1",
})
*/
@Controller()
export class MigrationControllerV1 {
  public constructor(
    @Inject(MigrationsUseCase) private readonly migrationUseCase: MigrationsUseCase
  ) {
    console.log("RUNNING CONSTRUCTOR");
  }

  @Get()
  @HttpCode(200)
  public async findAll(): Promise<Array<Migration>> {
    console.log("FOOBAR");

    const migrations = await this.migrationUseCase.getAllMigrations();

    console.log("migrations:", migrations);

    return migrations;
  }

  @Get("/pending")
  @HttpCode(200)
  public async findAllPending(): Promise<Array<Migration>> {
    const migrations = await this.migrationUseCase.getAllPendingMigrations();

    return migrations;
  }

  @Get("/test")
  @HttpCode(200)
  public hello(): string {
    return "Hello Test";
  }
}
