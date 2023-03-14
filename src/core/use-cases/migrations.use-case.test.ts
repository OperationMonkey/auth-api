import { Test } from "@nestjs/testing";

import { MigrationsPort } from "../ports/migrations.port";
import { MockMigrationsPort } from "../ports/migrations.port.mock";

import { MigrationsUseCase } from "./migrations.use-case";

/**
 * @todo move tests under /test to keep /src readable
 */

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
