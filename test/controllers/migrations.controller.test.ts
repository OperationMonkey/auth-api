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
  let migrationsPort: MigrationsPort;

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
        { provide: MigrationsPort, useValue: MockMigrationsPort },
      ],
    })
      .overrideProvider(MigrationsPort)
      .useValue(MockMigrationsPort)
      .compile();

    app = moduleRef.createNestApplication();
    migrationsPort = moduleRef.get(MigrationsPort);
    await app.init();
  });

  it.skip("GET /migrations", () => {
    (migrationsPort.getAllMigrations as jest.Mock).mockResolvedValue([
      { name: "name1", orderNumber: 123 },
    ]);

    return request(app.getHttpServer()).get("/v1/migrations").expect(200).expect({ data: [] });
  });

  afterAll(async () => {
    await app.close();
  });
});
