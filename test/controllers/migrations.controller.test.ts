import type { INestApplication } from "@nestjs/common";
import { VersioningType } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { MigrationControllerV1 } from "../../src/controllers/migrations.controller";
import type { Migration } from "../../src/core/entities/migration";
import { DatabasePort } from "../../src/core/ports/database.port";
import { LoggerPort } from "../../src/core/ports/logger.port";
import { MigrationsUseCase } from "../../src/core/use-cases/migrations.use-case";
import { MockLoggerPort } from "../core/ports/logger.port.mock";
import { MockDatabasePort } from "../core/ports/migrations.port.mock";

describe("Migrations Controller", () => {
  let app: INestApplication;
  const databasePort: DatabasePort = {
    ...MockDatabasePort,
    migrations: {
      getAllMigrations: (): Promise<Array<Migration>> =>
        Promise.resolve([
          { name: "name1", orderNumber: 123 },
          { name: "add table", orderNumber: 234 },
          { name: "default users", orderNumber: 657 },
          { name: "insert services", orderNumber: 987 },
        ]),
      prepareDatabase: jest.fn(),
      /**
       * @note onModuleInit() in MigrationsUseCase requires getOrderNumbersOfMigrated to return an array
       */
      getOrderNumbersOfMigrated: (): Promise<Array<number>> => Promise.resolve([123, 234]),
      up: jest.fn(),
      down: jest.fn(),
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MigrationControllerV1],
      providers: [
        MigrationsUseCase,
        { provide: LoggerPort, useValue: MockLoggerPort },
        {
          provide: DatabasePort,
          useValue: databasePort,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.enableVersioning({ type: VersioningType.URI }).init();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("GET /", () => {
    jest.spyOn(databasePort.migrations, "getAllMigrations").mockImplementation(() =>
      Promise.resolve([
        { name: "name2", orderNumber: 123 },
        { name: "another", orderNumber: 234 },
      ])
    );

    return request(app.getHttpServer())
      .get("/v1/migrations")
      .expect(200)
      .expect([
        { name: "name2", orderNumber: 123 },
        { name: "another", orderNumber: 234 },
      ]);
  });

  it("GET /pending", () => {
    return request(app.getHttpServer())
      .get("/v1/migrations/pending")
      .expect(200)
      .expect([
        { name: "default users", orderNumber: 657 },
        { name: "insert services", orderNumber: 987 },
      ]);
  });

  afterAll(async () => {
    await app.close();
  });
});
