import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { CodeAdapter } from "./adapters/code.adapter";
import { ConfigAdapter } from "./adapters/config.adapter";
import { LoggerAdapter } from "./adapters/logger.adapter";
import { PostgresAdapter } from "./adapters/postgres.adapter";
import { MigrationControllerV1 } from "./controllers/migrations.controller";
import { CodePort } from "./core/ports/code.port";
import { ConfigPort } from "./core/ports/config.port";
import { LoggerPort } from "./core/ports/logger.port";
import { MigrationsPort } from "./core/ports/migrations.port";
import { MigrationsUseCase } from "./core/use-cases/migrations.use-case";
import { validateEnvironment } from "./utils/validate-environment";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnvironment,
    }),
  ],
  controllers: [MigrationControllerV1],
  providers: [
    MigrationsUseCase,
    {
      provide: CodePort,
      useClass: CodeAdapter,
    },
    {
      provide: ConfigPort,
      useClass: ConfigAdapter,
    },
    {
      provide: LoggerPort,
      useClass: LoggerAdapter,
    },
    {
      provide: MigrationsPort,
      useClass: PostgresAdapter,
    },
  ],
})
export class AppModule {}
