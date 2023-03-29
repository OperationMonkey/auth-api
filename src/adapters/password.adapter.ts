import { Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";

import { InvalidPasswordException } from "../core/exceptions/invalid-password.error";

import type { PasswordPort } from "../core/ports/password.port";

@Injectable()
export class PasswordAdapter implements PasswordPort {
  /**
   * @todo fix this :D
   */
  public isValidPassword(password: string): boolean {
    if (password.length < 10) {
      throw new InvalidPasswordException("Password too short");
    }

    return true;
  }

  public async createPasswordHash(password: string, passwordVerifier: string): Promise<string> {
    if (password !== passwordVerifier) {
      throw new InvalidPasswordException("Passwords did not match");
    }
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    return hash;
  }

  public async checkPassword(password: string, hash: string): Promise<boolean> {
    const success = await bcrypt.compare(password, hash);

    return success;
  }
}
