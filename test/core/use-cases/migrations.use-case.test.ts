import { Test } from "@nestjs/testing";

import { DatabaseException } from "../../../src/core/exceptions/database.error";
import { MigrationException } from "../../../src/core/exceptions/migration.error";
import { DatabasePort } from "../../../src/core/ports/database.port";
import { LoggerPort } from "../../../src/core/ports/logger.port";
import { MigrationsUseCase } from "../../../src/core/use-cases/migrations.use-case";
import { MockLoggerPort } from "../ports/logger.port.mock";
import { MockDatabasePort } from "../ports/migrations.port.mock";

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
          provide: DatabasePort,
          useValue: MockDatabasePort,
        },
      ],
    }).compile();

    useCase = module.get<MigrationsUseCase>(MigrationsUseCase);
    jest.clearAllMocks();
  });

  it("should run all migrations from onModuleInit if no migrations in database", async () => {
    jest.spyOn(MockDatabasePort.migrations, "getOrderNumbersOfMigrated").mockResolvedValue([]);
    jest.spyOn(MockDatabasePort.migrations, "getAllMigrations").mockResolvedValue([
      { name: "name8", orderNumber: 456 },
      { name: "name4", orderNumber: 234 },
    ]);
    const mockUp = jest.spyOn(MockDatabasePort.migrations, "up");

    await useCase.onModuleInit();

    expect(mockUp).toHaveBeenCalledTimes(2);
    expect(mockUp.mock.calls).toEqual([[234], [456]]);
  });

  it("should return all migrations", async () => {
    jest.spyOn(MockDatabasePort.migrations, "getAllMigrations").mockResolvedValueOnce([
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
    jest.spyOn(MockDatabasePort.migrations, "getAllMigrations").mockResolvedValueOnce([
      { name: "name5", orderNumber: 153456 },
      { name: "name3", orderNumber: 113456 },
      { name: "name9", orderNumber: 123456 },
    ]);
    jest
      .spyOn(MockDatabasePort.migrations, "getOrderNumbersOfMigrated")
      .mockResolvedValueOnce([113456]);

    const result = await useCase.getAllPendingMigrations();

    expect(result).toEqual([
      { name: "name9", orderNumber: 123456 },
      { name: "name5", orderNumber: 153456 },
    ]);
  });

  it("should re-throw errors if migration up fails", async () => {
    jest.spyOn(MockDatabasePort.migrations, "getAllMigrations").mockResolvedValueOnce([
      { name: "name5", orderNumber: 153456 },
      { name: "name3", orderNumber: 113456 },
      { name: "name9", orderNumber: 123456 },
    ]);
    jest
      .spyOn(MockDatabasePort.migrations, "getOrderNumbersOfMigrated")
      .mockResolvedValueOnce([113456]);
    jest.spyOn(MockDatabasePort.migrations, "up").mockImplementationOnce(() => {
      throw new DatabaseException("Database error");
    });
    await expect(useCase.runSingleMigrationUp()).rejects.toEqual(
      new DatabaseException("Database error")
    );
  });

  it("should re-throw errors if migration down fails", async () => {
    jest
      .spyOn(MockDatabasePort.migrations, "getOrderNumbersOfMigrated")
      .mockResolvedValueOnce([123, 345, 666]);
    jest.spyOn(MockDatabasePort.migrations, "down").mockImplementationOnce(() => {
      throw new MigrationException("Migration not found");
    });
    await expect(useCase.runSingleMigrationDown()).rejects.toEqual(
      new MigrationException("Migration not found")
    );
  });

  it("should run all migrations by orderNumber", async () => {
    jest.spyOn(MockDatabasePort.migrations, "getAllMigrations").mockResolvedValueOnce([
      { name: "name3", orderNumber: 3 },
      { name: "name1", orderNumber: 1 },
      { name: "name2", orderNumber: 2 },
    ]);
    jest.spyOn(MockDatabasePort.migrations, "getOrderNumbersOfMigrated").mockResolvedValueOnce([]);
    const mockUp = jest.spyOn(MockDatabasePort.migrations, "up");

    await useCase.runAllMigrations();

    expect(mockUp).toHaveBeenCalledTimes(3);
    expect(mockUp.mock.calls).toEqual([[1], [2], [3]]);
  });

  it("should run pending migrations only", async () => {
    jest.spyOn(MockDatabasePort.migrations, "getAllMigrations").mockResolvedValueOnce([
      { name: "name7", orderNumber: 7000 },
      { name: "name5", orderNumber: 555 },
      { name: "name4", orderNumber: 444 },
      { name: "name3", orderNumber: 344 },
      { name: "name1", orderNumber: 111 },
    ]);
    jest
      .spyOn(MockDatabasePort.migrations, "getOrderNumbersOfMigrated")
      .mockResolvedValueOnce([111, 344]);
    const mockUp = jest.spyOn(MockDatabasePort.migrations, "up");

    await useCase.runAllMigrations();

    expect(mockUp).toHaveBeenCalledTimes(3);
    expect(mockUp.mock.calls).toEqual([[444], [555], [7000]]);
  });

  it("should run next pending migration up", async () => {
    jest.spyOn(MockDatabasePort.migrations, "getAllMigrations").mockResolvedValueOnce([
      { name: "name7", orderNumber: 7000 },
      { name: "name5", orderNumber: 555 },
      { name: "name4", orderNumber: 444 },
      { name: "name3", orderNumber: 344 },
      { name: "name1", orderNumber: 111 },
    ]);
    jest
      .spyOn(MockDatabasePort.migrations, "getOrderNumbersOfMigrated")
      .mockResolvedValueOnce([111, 344]);
    const mockUp = jest.spyOn(MockDatabasePort.migrations, "up");

    await useCase.runSingleMigrationUp();

    expect(mockUp).toHaveBeenCalledTimes(1);
    expect(mockUp.mock.calls).toEqual([[444]]);
  });

  it("should run last migration down", async () => {
    jest.spyOn(MockDatabasePort.migrations, "getAllMigrations").mockResolvedValueOnce([
      { name: "name7", orderNumber: 7000 },
      { name: "name5", orderNumber: 555 },
      { name: "name4", orderNumber: 444 },
      { name: "name3", orderNumber: 344 },
      { name: "name1", orderNumber: 111 },
    ]);
    jest
      .spyOn(MockDatabasePort.migrations, "getOrderNumbersOfMigrated")
      .mockResolvedValueOnce([344, 111]);
    const mockDown = jest.spyOn(MockDatabasePort.migrations, "down");

    await useCase.runSingleMigrationDown();

    expect(mockDown).toHaveBeenCalledTimes(1);
    expect(mockDown.mock.calls).toEqual([[344]]);
  });
});
