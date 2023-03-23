import { z } from "zod";

import type { EnvironmentVariables } from "../core/ports/config.port";

const environmentSchema = z.object({
  PORT: z.coerce.number(),
  DATABASE_URL: z.coerce.string(),
});

export function validateEnvironment(config: Record<string, unknown>): EnvironmentVariables {
  const result = environmentSchema.parse(config);

  return result;
}
