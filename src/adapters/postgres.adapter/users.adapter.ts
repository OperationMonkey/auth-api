/**
 * @todo remove eslint-disable once adapter implemented
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as Crypto from "crypto";

import type { User } from "../../core/entities/user";
import { DatabaseException } from "../../core/exceptions/database.error";
import type { UsersPort } from "../../core/ports/database.port";

import { parseUser } from "./validators";

import type { PostgresAdapter } from ".";

/**
 * @interface UsersPort is implemented here
 */
export class UsersAdapter implements UsersPort {
  private readonly postgresAdapter: PostgresAdapter;

  public constructor(postgresAdapter: PostgresAdapter) {
    this.postgresAdapter = postgresAdapter;
  }

  public async addUser(
    username: string,
    password: string,
    name: string,
    email: string
  ): Promise<User> {
    try {
      const sql =
        "INSERT INTO accounts(id, username, password, name, email) \
                   VALUES($1,$2,$3,$4,$5) RETURNING id, username, name, email, \
                   admin, locked, deleted, created_on, modified_on";
      const values = [Crypto.randomUUID(), username, password, name, email];
      const result = await this.postgresAdapter.__runQuery(sql, values);

      return parseUser(result.rows[0]);
    } catch (error) {
      if (error instanceof DatabaseException) {
        throw error;
      } else {
        throw new DatabaseException("Query gave incorrect result");
      }
    }
  }

  public updateUser(
    id: string,
    username: string,
    password: string,
    name: string,
    email: string
  ): Promise<User> {
    throw new Error("Method not implemented.");
  }

  public updatePassword(id: string, password: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public findUserById(id: string): Promise<User> {
    throw new Error("Method not implemented.");
  }

  public findUserByUsername(username: string): Promise<User> {
    throw new Error("Method not implemented.");
  }

  public deleteUser(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
