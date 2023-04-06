import { z } from "zod";

import type { User } from "../../core/entities/user";

export function parseUser(data: unknown): User {
  const userSchema = z
    .object({
      id: z.string().uuid(),
      username: z.string(),
      name: z.string(),
      email: z.string(),
      admin: z.boolean(),
      locked: z.boolean(),
      deleted: z.boolean(),
      created_on: z.string(),
      modified_on: z.string(),
    })
    .transform((user) => {
      const { created_on, modified_on, ...rest } = user;

      return {
        ...rest,
        createdOn: new Date(created_on),
        modifiedOn: new Date(modified_on),
      };
    });

  const user = userSchema.safeParse(data);

  if (user.success) {
    return user.data;
  }
  /**
   * @todo do not leave this like this
   */
  throw new Error("Failure!");
}

/*
export function isValidUser(obj: unknown): obj is User {
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
*/
