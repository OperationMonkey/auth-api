import type { DatabasePort } from "../../../src/core/ports/database.port";

export const MockDatabasePort: DatabasePort = {
  migrations: {
    prepareDatabase: jest.fn(),
    getAllMigrations: jest.fn(),
    getOrderNumbersOfMigrated: jest.fn(),
    up: jest.fn(),
    down: jest.fn(),
  },
  users: {
    addUser: jest.fn(),
    updateUser: jest.fn(),
    updatePassword: jest.fn(),
    getUserById: jest.fn(),
    getUserAndPasswordByUsername: jest.fn(),
    deleteUser: jest.fn(),
  },
};
