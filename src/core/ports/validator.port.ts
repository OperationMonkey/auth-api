import type { User } from "../entities/user";

export const ValidatorPort = Symbol("ValidatorPort");

interface Valid<T> {
  success: true;
  data: T;
}

interface Invalid {
  success: false;
}

export type ParseResult<T> = Valid<T> | Invalid;

export interface ValidatorPort {
  isValidUser(obj: unknown): obj is User;
  parseUser(data: unknown): ParseResult<User>;
}
