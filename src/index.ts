import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app";
import { authorize } from "./controllers/middleware/authorize";
import { ConfigPort } from "./core/ports/config.port";
import { LoggerPort } from "./core/ports/logger.port";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = app.get<ConfigPort>(ConfigPort);
  const logger = app.get<LoggerPort>(LoggerPort);

  app.use(authorize);

  await app.listen(config.port);
  logger.info(`app started on port ${config.port}`);
}

void bootstrap();
