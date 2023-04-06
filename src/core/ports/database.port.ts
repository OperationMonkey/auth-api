import type { Migration } from "../entities/migration";
import type { User } from "../entities/user";

export const DatabasePort = Symbol("DatabasePort");

export interface MigrationsPort {
  prepareDatabase(): Promise<void>;
  getAllMigrations(): Promise<Array<Migration>>;
  getOrderNumbersOfMigrated(): Promise<Array<number>>;
  up(orderNumber: number): Promise<boolean>;
  down(orderNumber: number): Promise<boolean>;
}

export interface UsersPort {
  addUser(username: string, password: string, name: string, email: string): Promise<User>;
  updateUser(
    id: string,
    username: string,
    password: string,
    name: string,
    email: string
  ): Promise<User>;
  updatePassword(id: string, password: string): Promise<void>;
  findUserById(id: string): Promise<User>;
  findUserByUsername(username: string): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

export interface DatabasePort {
  migrations: MigrationsPort;
  users: UsersPort;
}
