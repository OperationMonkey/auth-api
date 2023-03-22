export class MigrationException extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "MigrationException";
  }
}
