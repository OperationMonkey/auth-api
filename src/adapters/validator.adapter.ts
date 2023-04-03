import { Injectable } from "@nestjs/common";

import { z } from "zod";

import type { User } from "../core/entities/user";
import type { ParseResult, ValidatorPort } from "../core/ports/validator.port";

@Injectable()
export class ValidatorAdapter implements ValidatorPort {
  public parseUser(data: unknown): ParseResult<User> {
    throw new Error("Will implement later");
  }

  public isValidUser(obj: unknown): obj is User {
    const userSchema = z
      .object({
        id: z.string().uuid(),
        username: z
          .string()
          .min(3)
          .regex(/^[a-z0-9]+$/),
        name: z.string(),
        email: z.string().email(),
        admin: z.boolean(),
        locked: z.boolean(),
        deleted: z.boolean(),
        createdOn: z.date(),
        modifiedOn: z.date(),
      })
      .strict();

    return userSchema.safeParse(obj).success;
  }
}
