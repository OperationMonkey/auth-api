import { Module } from "@nestjs/common";

import { PostgresAdapter } from "./adapters/postgres.adapter";
import { MigrationsPort } from "./core/ports/migrations.port";

@Module({
  providers: [
    {
      provide: MigrationsPort,
      useClass: PostgresAdapter,
    },
  ],
})
export class AppModule {}
