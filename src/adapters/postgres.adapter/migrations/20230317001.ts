import type { PostgresMigration } from ".";

export const migration: PostgresMigration = {
  name: "Create users table",
  orderNumber: 20230317001,
  up: "CREATE TABLE IF NOT EXISTS account (id VARCHAR(50) PRIMARY KEY);",
  down: "DROP TABLE account",
};
