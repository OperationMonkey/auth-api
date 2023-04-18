import type { MiddlewareConsumer, NestModule } from "@nestjs/common";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { CodeAdapter } from "./adapters/code.adapter";
import { ConfigAdapter } from "./adapters/config.adapter";
import { LoggerAdapter } from "./adapters/logger.adapter";
import { PasswordAdapter } from "./adapters/password.adapter";
import { PostgresAdapter } from "./adapters/postgres.adapter";
import { AuthorizeAdmin } from "./controllers/middleware/authorize-admin";
import { AuthorizeUser } from "./controllers/middleware/authorize-user";
import { MigrationControllerV1 } from "./controllers/migrations.controller";
import { UserControllerV1 } from "./controllers/users.controller";
import { CodePort } from "./core/ports/code.port";
import { ConfigPort } from "./core/ports/config.port";
import { DatabasePort } from "./core/ports/database.port";
import { LoggerPort } from "./core/ports/logger.port";
import { PasswordPort } from "./core/ports/password.port";
import { MigrationsUseCase } from "./core/use-cases/migrations.use-case";
import { RegisterNewUserUseCase } from "./core/use-cases/register-new-user.use-case";
import { validateEnvironment } from "./utils/validate-environment";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnvironment,
    }),
  ],
  controllers: [MigrationControllerV1, UserControllerV1],
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
      provide: DatabasePort,
      useClass: PostgresAdapter,
    },
    {
      provide: PasswordPort,
      useClass: PasswordAdapter,
    },
    RegisterNewUserUseCase,
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthorizeAdmin)
      .forRoutes("/v1/migrations")
      .apply(AuthorizeUser)
      .forRoutes("/v1/users");
  }
}
