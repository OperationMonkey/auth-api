import type { Migration } from "../core/entities/migration";

import { migration as migration001 } from "./20230317001";

export const migrations: Array<Migration> = [migration001];
