import { z } from "zod";

import type { User, UserWithPassword } from "../../core/entities/user";

const userSchema = z
  .object({
    id: z.string(),
    username: z.string(),
    name: z.string(),
    email: z.string(),
    admin: z.boolean(),
    locked: z.boolean(),
    deleted: z.boolean(),
    created_on: z.string(),
    modified_on: z.string(),
  })
  .strict();

const userWithPasswordSchema = userSchema.extend({
  password: z.string(),
});

export function parseUser(data: unknown): User {
  const user = userSchema
    .transform((user) => {
      const { created_on, modified_on, ...rest } = user;

      return {
        ...rest,
        createdOn: new Date(created_on),
        modifiedOn: new Date(modified_on),
      };
    })
    .safeParse(data);

  if (user.success) {
    return user.data;
  }
  /**
   * @todo do not leave this like this
   */
  throw new Error("Failure!");
}

export function parseUserWithPassword(data: unknown): UserWithPassword {
  const userWithPassword = userWithPasswordSchema
    .transform((user) => {
      const { created_on, modified_on, ...rest } = user;

      return {
        ...rest,
        createdOn: new Date(created_on),
        modifiedOn: new Date(modified_on),
      };
    })
    .safeParse(data);

  if (userWithPassword.success) {
    return userWithPassword.data;
  }

  /**
   * @todo do not leave this like this
   */
  throw new Error("Failure!");
}
