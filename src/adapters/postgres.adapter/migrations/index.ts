import type { Migration } from "../../../core/entities/migration";

import { migration as migration001 } from "./20230317001";
import { migration as migration002 } from "./20230321001";
import { migration as migration003 } from "./20230321002";
import { migration as migration004 } from "./20230324001";
import { migration as migration005 } from "./20230324002";

export interface PostgresMigration extends Migration {
  up: string;
  down: string;
}

export const migrations: Array<PostgresMigration> = [
  migration001,
  migration002,
  migration003,
  migration004,
  migration005,
];
