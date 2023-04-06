import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import type { Migration } from "../../src/core/entities/migration";
import { DatabasePort } from "../../src/core/ports/database.port";
import { LoggerPort } from "../../src/core/ports/logger.port";
import { MigrationsUseCase } from "../../src/core/use-cases/migrations.use-case";
import { MockLoggerPort } from "../core/ports/logger.port.mock";
import { MockDatabasePort } from "../core/ports/migrations.port.mock";

describe("Migrations Controller", () => {
  let app: INestApplication;
  let databasePort: DatabasePort;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: MigrationsUseCase,
          useValue: {
            getAllMigrations: (): Promise<Array<Migration>> =>
              Promise.resolve([{ name: "name1", orderNumber: 123 }]),
          },
        },
        { provide: LoggerPort, useValue: MockLoggerPort },
        { provide: DatabasePort, useValue: MockDatabasePort },
      ],
    })
      .overrideProvider(DatabasePort)
      .useValue(MockDatabasePort)
      .compile();

    app = moduleRef.createNestApplication();
    databasePort = moduleRef.get(DatabasePort);
    await app.init();
  });

  it.skip("GET /migrations", () => {
    (databasePort.migrations.getAllMigrations as jest.Mock).mockResolvedValue([
      { name: "name1", orderNumber: 123 },
    ]);

    return request(app.getHttpServer()).get("/v1/migrations").expect(200).expect({ data: [] });
  });

  afterAll(async () => {
    await app.close();
  });
});
