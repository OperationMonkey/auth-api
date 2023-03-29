export class InvalidPasswordException extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "InvalidPasswordException";
  }
}
