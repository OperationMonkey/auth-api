import { Controller, Get } from "@nestjs/common";

import type { Migration } from "../core/entities/migration";

/**
 * @todo think if we should define version in function level
 */
@Controller({
  path: "migrations",
  version: "1",
})
export class MigrationControllerV1 {
  @Get()
  public findAllV1(): Promise<Array<Migration>> {
    return Promise.resolve([
      { id: "1-2-3", up: "create table foo", down: "delete table", orderNumber: 1 },
    ]);
  }
}
