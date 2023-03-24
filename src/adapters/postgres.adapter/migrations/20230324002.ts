import type { PostgresMigration } from ".";

export const migration: PostgresMigration = {
  up: "CREATE TABLE IF NOT EXISTS codes (\
    id VARCHAR(50) PRIMARY KEY,\
    user_id VARCHAR(50) NOT NULL,\
    client_id VARCHAR(50) NOT NULL,\
    resource_id VARCHAR(50) NOT NULL,\
    code VARCHAR(100) NOT NULL,\
    code_challenge VARCHAR(100) NOT NULL,\
    full_info BOOLEAN NOT NULL DEFAULT FALSE,\
    read_only BOOLEAN NOT NULL DEFAULT TRUE,\
    created_on TIMESTAMP NOT NULL DEFAULT current_timestamp\
    );",
  down: "DROP TABLE IF EXISTS codes",
  name: "Add codes table",
  orderNumber: 20230324002,
};
