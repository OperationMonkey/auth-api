import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app";

export function addition(left: number, right: number): number {
  return left + right;
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}

/**
 * @todo this is just an ad hoc solution to run test for now
 */
if (process.env["START_APP"] === "true") {
  void bootstrap();
}
