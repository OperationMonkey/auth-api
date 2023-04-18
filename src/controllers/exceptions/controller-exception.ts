/**
 * @todo remove the eslint-disable
 */
// eslint-disable-next-line import/no-unused-modules
export class ControllerException extends Error {
  public status: number;
  public constructor(status: number, message?: string) {
    let msg: string | undefined;

    switch (status) {
      case 500:
        msg = "Internal server error";
        break;
      default:
        msg = message;
        break;
    }
    super(msg);
    this.status = status;
  }
}
