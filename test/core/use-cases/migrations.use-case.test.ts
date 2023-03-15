import { Test } from "@nestjs/testing";

import { MigrationsPort } from "../../../src/core/ports/migrations.port";
import { MockMigrationsPort } from "../../../src/core/ports/migrations.port.mock";

import { MigrationsUseCase } from "../../../src/core/use-cases/migrations.use-case";

describe("Migrations use-case", () => {
  let useCase: MigrationsUseCase;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MigrationsUseCase,
        {
          provide: MigrationsPort,
          useClass: MockMigrationsPort,
        },
      ],
    }).compile();

    useCase = module.get<MigrationsUseCase>(MigrationsUseCase);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });
});
