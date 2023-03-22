import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import type { Migration } from "../../src/core/entities/migration";
import { LoggerPort } from "../../src/core/ports/logger.port";
import { MigrationsPort } from "../../src/core/ports/migrations.port";
import { MigrationsUseCase } from "../../src/core/use-cases/migrations.use-case";
import { MockLoggerPort } from "../core/ports/logger.port.mock";
import { MockMigrationsPort } from "../core/ports/migrations.port.mock";

describe("Migrations Controller", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        // MigrationsUseCase,
        {
          provide: MigrationsUseCase,
          useValue: {
            getAllMigrations: (): Promise<Array<Migration>> =>
              Promise.resolve([{ name: "name1", orderNumber: 123 }]),
          },
        },
        { provide: LoggerPort, useValue: MockLoggerPort },
        { provide: MigrationsPort, useValue: MockMigrationsPort },
      ],
    })
      /*
      .overrideProvider(MigrationsUseCase)
      .useValue({
        getAllMigrations: (): Array<Migration> => {
          console.log("foobar");

          return [{ name: "name1", orderNumber: 123 }];
        },
      })*/
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it("GET /migrations", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = request(app.getHttpServer()).get("/migrations").expect(200);

    // expect(result).toEqual({});
  });

  afterAll(async () => {
    await app.close();
  });
});
