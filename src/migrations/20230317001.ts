import type { Migration } from "../core/entities/migration";

export const migration: Migration = {
  id: "29a14c7a-8ee9-4798-90a4-5c1a9f306153",
  orderNumber: 20230317001,
  up: "CREATE TABLE IF NOT EXISTS account (id VARCHAR(50) PRIMARY KEY);",
  down: "DROP TABLE account",
};
