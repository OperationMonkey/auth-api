import type { PostgresMigration } from ".";

export const migration: PostgresMigration = {
  up: "CREATE TABLE IF NOT EXISTS services (\
    id VARCHAR(50) PRIMARY KEY,\
    name VARCHAR(100) UNIQUE NOT NULL,\
    redirect_url VARCHAR(100),\
    created_on TIMESTAMP NOT NULL DEFAULT current_timestamp\
    );",
  down: "DROP TABLE IF EXISTS services",
  name: "Create services table",
  orderNumber: 20230321001,
};
