import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app";

export function addition(left: number, right: number): number {
  return left + right;
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(3000);
  console.log("app started on port 3000");
}

/**
 * @todo this is just an ad hoc solution to run test for now
 */
if (process.env["START_APP"] === "true") {
  void bootstrap();
}
