import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app";
import { ConfigPort } from "./core/ports/config.port";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = app.get<ConfigPort>(ConfigPort);

  await app.listen(config.port);
  console.log(`app started on port ${config.port}`);
}

void bootstrap();
