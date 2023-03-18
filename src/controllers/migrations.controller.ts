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
    return Promise.resolve([{ name: "name of migration", orderNumber: 1 }]);
  }
}
