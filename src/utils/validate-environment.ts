import { z } from "zod";

import type { EnvironmentVariables } from "../core/ports/config.port";

const environtmentSchema = z.object({
  PORT: z.coerce.number(),
  DATABASE_URL: z.coerce.string(),
});

export function validateEnvironment(config: Record<string, unknown>): EnvironmentVariables {
  const result = environtmentSchema.parse(config);

  return result;
}
