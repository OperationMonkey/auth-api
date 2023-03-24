import type { PostgresMigration } from ".";

export const migration: PostgresMigration = {
  up: "CREATE TABLE IF NOT EXISTS allowed_clients (\
    resource_id VARCHAR(50) NOT NULL,\
    client_id VARCHAR(50) NOT NULL,\
    created_on TIMESTAMP NOT NULL DEFAULT current_timestamp,\
    PRIMARY KEY (resource_id, client_id)\
    );",
  down: "DROP TABLE IF EXISTS allowed_clients",
  name: "Create allowed_clients table",
  orderNumber: 20230321002,
};
