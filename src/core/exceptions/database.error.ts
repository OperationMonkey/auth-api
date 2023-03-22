export class DatabaseException extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "DatabaseException";
  }
}
