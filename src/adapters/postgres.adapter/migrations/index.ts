import type { Migration } from "../../../core/entities/migration";

import { migration as migration001 } from "./20230317001";

export interface PostgresMigration extends Migration {
  up: string;
  down: string;
}

export const migrations: Array<PostgresMigration> = [migration001];
