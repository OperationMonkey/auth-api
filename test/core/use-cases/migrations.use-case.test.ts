import { Test } from "@nestjs/testing";

import { DatabaseException } from "../../../src/core/exceptions/database.error";
import { MigrationException } from "../../../src/core/exceptions/migration.error";

import { LoggerPort } from "../../../src/core/ports/logger.port";

import { MigrationsPort } from "../../../src/core/ports/migrations.port";
import { MigrationsUseCase } from "../../../src/core/use-cases/migrations.use-case";
import { MockLoggerPort } from "../ports/logger.port.mock";
import { MockMigrationsPort } from "../ports/migrations.port.mock";

describe("Migrations use-case", () => {
  let useCase: MigrationsUseCase;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MigrationsUseCase,
        {
          provide: LoggerPort,
          useValue: MockLoggerPort,
        },
        {
          provide: MigrationsPort,
          useValue: MockMigrationsPort,
        },
      ],
    }).compile();

    useCase = module.get<MigrationsUseCase>(MigrationsUseCase);
    jest.clearAllMocks();
  });

  it("should return all migrations", async () => {
    jest.spyOn(MockMigrationsPort, "getAllMigrations").mockResolvedValueOnce([
      { name: "name4", orderNumber: 123 },
      { name: "name8", orderNumber: 234 },
    ]);

    const result = await useCase.getAllMigrations();

    expect(result).toEqual([
      { name: "name4", orderNumber: 123 },
      { name: "name8", orderNumber: 234 },
    ]);
  });

  it("should return all pending migrations", async () => {
    jest.spyOn(MockMigrationsPort, "getAllMigrations").mockResolvedValueOnce([
      { name: "name5", orderNumber: 153456 },
      { name: "name3", orderNumber: 113456 },
      { name: "name9", orderNumber: 123456 },
    ]);
    jest.spyOn(MockMigrationsPort, "getOrderNumbersOfMigrated").mockResolvedValueOnce([113456]);

    const result = await useCase.getAllPendingMigrations();

    expect(result).toEqual([
      { name: "name9", orderNumber: 123456 },
      { name: "name5", orderNumber: 153456 },
    ]);
  });

  it("should re-throw errors if migration up fails", async () => {
    jest.spyOn(MockMigrationsPort, "up").mockImplementationOnce(() => {
      throw new DatabaseException("Database error");
    });
    await expect(useCase.runSingleMigrationUp(666)).rejects.toEqual(
      new DatabaseException("Database error")
    );
  });

  it("should re-throw errors if migration down fails", async () => {
    jest.spyOn(MockMigrationsPort, "down").mockImplementationOnce(() => {
      throw new MigrationException("Migration not found");
    });
    await expect(useCase.runSingleMigrationDown(666)).rejects.toEqual(
      new MigrationException("Migration not found")
    );
  });

  it("should run all migrations by orderNumber", async () => {
    jest.spyOn(MockMigrationsPort, "getAllMigrations").mockResolvedValueOnce([
      { name: "name3", orderNumber: 3 },
      { name: "name1", orderNumber: 1 },
      { name: "name2", orderNumber: 2 },
    ]);
    jest.spyOn(MockMigrationsPort, "getOrderNumbersOfMigrated").mockResolvedValueOnce([1]);
    const mockUp = jest.spyOn(MockMigrationsPort, "up");

    await useCase.runAllMigrations();

    expect(mockUp).toHaveBeenCalledTimes(2);
    expect(mockUp.mock.calls).toEqual([[2], [3]]);
  });

  it("should run all migrations from onModuleInit", async () => {
    jest.spyOn(MockMigrationsPort, "getAllMigrations").mockResolvedValueOnce([
      { name: "name7", orderNumber: 7000 },
      { name: "name5", orderNumber: 555 },
      { name: "name4", orderNumber: 444 },
      { name: "name3", orderNumber: 344 },
      { name: "name1", orderNumber: 111 },
    ]);
    jest.spyOn(MockMigrationsPort, "getOrderNumbersOfMigrated").mockResolvedValueOnce([111, 344]);
    const mockUp = jest.spyOn(MockMigrationsPort, "up");

    await useCase.onModuleInit();

    expect(mockUp).toHaveBeenCalledTimes(3);
    expect(mockUp.mock.calls).toEqual([[444], [555], [7000]]);
  });
});
