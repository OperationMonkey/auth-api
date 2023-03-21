import type { PostgresMigration } from ".";

export const migration: PostgresMigration = {
  name: "Create accounts table",
  orderNumber: 20230317001,
  up: "CREATE TABLE IF NOT EXISTS accounts (\
    id VARCHAR(50) PRIMARY KEY,\
    username VARCHAR(50) UNIQUE NOT NULL,\
    password VARCHAR(100) NOT NULL,\
    name VARCHAR(100) NOT NULL,\
    email VARCHAR(100) NOT NULL,\
    admin BOOLEAN NOT NULL DEFAULT FALSE,\
    locked BOOLEAN NOT NULL DEFAULT FALSE,\
    deleted BOOLEAN NOT NULL DEFAULT FALSE,\
    created_on TIMESTAMP NOT NULL DEFAULT current_timestamp\
    );",
  down: "DROP TABLE IF EXISTS accounts",
};
