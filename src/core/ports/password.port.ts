export const PasswordPort = Symbol("PasswordPort");

export interface PasswordPort {
  /**
   * valid password return true, invalid throws InvalidPasswordException telling the reason
   */
  isValidPassword(password: string): boolean;
  createPasswordHash(password: string, passwordVerifier: string): Promise<string>;
  checkPassword(password: string, hash: string): Promise<boolean>;
}
