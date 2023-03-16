import { Injectable } from "@nestjs/common";

import type { LoggerPort } from "../core/ports/logger.port";

@Injectable()
export class LoggerAdapter implements LoggerPort {
  /**
   * @todo think about this, we need a smart solution
   */
  private reduceParams(...params: Array<unknown>): string {
    const foo = JSON.stringify(params.map((param) => JSON.stringify(param)));

    return foo;
  }

  public debug(...params: Array<unknown>): void {
    console.log(this.reduceParams(params));
  }

  public info(...params: Array<unknown>): void {
    console.log(this.reduceParams(params));
  }

  public error(...params: Array<unknown>): void {
    console.error(this.reduceParams(params));
  }
}
