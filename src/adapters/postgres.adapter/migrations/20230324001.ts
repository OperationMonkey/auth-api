import type { PostgresMigration } from ".";

export const migration: PostgresMigration = {
  up: "CREATE TABLE IF NOT EXISTS tokens (\
    id VARCHAR(50) PRIMARY KEY,\
    user_id VARCHAR(50) NOT NULL,\
    client_id VARCHAR(50) NOT NULL,\
    resource_id VARCHAR(50) NOT NULL,\
    expired BOOLEAN NOT NULL DEFAULT FALSE,\
    type VARCHAR(20) NOT NULL,\
    created_on TIMESTAMP NOT NULL DEFAULT current_timestamp\
    );",
  down: "DROP TABLE IF EXISTS tokens",
  name: "Add tokens table",
  orderNumber: 20230324001,
};
