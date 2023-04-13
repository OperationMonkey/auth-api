import { Inject, Injectable } from "@nestjs/common";

import type { User } from "../entities/user";
import { DatabasePort } from "../ports/database.port";
import { LoggerPort } from "../ports/logger.port";
import { PasswordPort } from "../ports/password.port";

@Injectable()
export class RegisterNewUserUseCase {
  public constructor(
    @Inject(LoggerPort) private readonly logger: LoggerPort,
    @Inject(DatabasePort) private readonly databaseAdapter: DatabasePort,
    @Inject(PasswordPort) private readonly passwordAdapter: PasswordPort
  ) {}

  public async register(
    username: string,
    name: string,
    email: string,
    password: string,
    verifyPassword: string
  ): Promise<User> {
    const passwordHash = await this.passwordAdapter.createPasswordHash(password, verifyPassword);
    const newUser = await this.databaseAdapter.users.addUser(username, passwordHash, name, email);

    return newUser;
  }
}
