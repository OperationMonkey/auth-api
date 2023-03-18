import { Test } from "@nestjs/testing";

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
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  /**
   * @todo fix this when usecase implementation progresses
   */
  it("should sort by orderNumber", async () => {
    jest.spyOn(MockMigrationsPort, "getAllMigrations").mockResolvedValueOnce([
      { name: "name3", orderNumber: 3 },
      { name: "name1", orderNumber: 1 },
      { name: "name2", orderNumber: 2 },
    ]);
    jest.spyOn(MockMigrationsPort, "getOrderNumbersOfMigrated").mockResolvedValueOnce([1]);
    const result = await useCase.runAllMigrations();

    expect(result).toEqual([
      { name: "name2", orderNumber: 2 },
      { name: "name3", orderNumber: 3 },
    ]);
  });
});
