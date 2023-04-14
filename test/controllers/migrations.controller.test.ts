import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

// import type { Migration } from "../../src/core/entities/migration";
import { DatabasePort } from "../../src/core/ports/database.port";
import { LoggerPort } from "../../src/core/ports/logger.port";
import { MigrationsUseCase } from "../../src/core/use-cases/migrations.use-case";
import { MockLoggerPort } from "../core/ports/logger.port.mock";
import { MockDatabasePort } from "../core/ports/migrations.port.mock";

describe("Migrations Controller", () => {
  let app: INestApplication;
  const databasePort: DatabasePort = {
    migrations: {
      getAllMigrations: () => Promise.resolve([{ name: "name1", orderNumber: 123 }]),
      prepareDatabase: jest.fn(),
      getOrderNumbersOfMigrated: () => Promise.resolve([]),
      up: jest.fn(),
      down: jest.fn(),
    },
    users: {
      addUser: jest.fn(),
      updateUser: jest.fn(),
      updatePassword: jest.fn(),
      getUserById: jest.fn(),
      getUserAndPasswordByUsername: jest.fn(),
      deleteUser: jest.fn(),
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      /*
      providers: [
        {
          provide: MigrationsUseCase,
          useValue: {
            getAllMigrations: (): Promise<Array<Migration>> =>
              Promise.resolve([{ name: "name1", orderNumber: 123 }]),
          },
        },
        */
      providers: [
        MigrationsUseCase,
        { provide: LoggerPort, useValue: MockLoggerPort },
        { provide: DatabasePort, useValue: MockDatabasePort },
      ],
    })
      .overrideProvider(DatabasePort)
      .useValue(databasePort)
      .compile();

    app = moduleRef.createNestApplication();
    //databasePort = moduleRef.get(DatabasePort);
    await app.init();
  });

  it.skip("GET /test", () => {
    //return request(app.getHttpServer()).get("/migrations/v1/test").expect(200);
    return request(app.getHttpServer()).get("/test").expect(200);
  });

  it.skip("GET /migrations", () => {
    /*
    (databasePort.migrations.getAllMigrations as jest.Mock).mockResolvedValue([
      { name: "name1", orderNumber: 123 },
    ]);
    */

    return request(app.getHttpServer()).get("/v1/migrations").expect(200).expect({ data: [] });
  });

  afterAll(async () => {
    await app.close();
  });
});
