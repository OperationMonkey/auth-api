import type { User } from "../entities/user";

export const UsersPort = Symbol("UsersPort");

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
