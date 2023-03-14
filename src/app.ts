import { Module } from "@nestjs/common";

import { PostgresAdapter } from "./adapters/postgres.adapter";
import { MigrationControllerV1 } from "./controllers/migrations.controller";
import { MigrationsPort } from "./core/ports/migrations.port";
import { MigrationsUseCase } from "./core/use-cases/migrations.use-case";

@Module({
  controllers: [MigrationControllerV1],
  providers: [
    MigrationsUseCase,
    {
      provide: MigrationsPort,
      useClass: PostgresAdapter,
    },
  ],
})
export class AppModule {}
