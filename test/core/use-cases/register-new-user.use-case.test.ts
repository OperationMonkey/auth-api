import { Test } from "@nestjs/testing";

import { PasswordAdapter } from "../../../src/adapters/password.adapter";
import { DatabasePort } from "../../../src/core/ports/database.port";
import { LoggerPort } from "../../../src/core/ports/logger.port";
import { PasswordPort } from "../../../src/core/ports/password.port";
import { RegisterNewUserUseCase } from "../../../src/core/use-cases/register-new-user.use-case";
import { MockLoggerPort } from "../ports/logger.port.mock";
import { MockDatabasePort } from "../ports/migrations.port.mock";

describe("RegisterNewUser use-case", () => {
  let useCase: RegisterNewUserUseCase;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RegisterNewUserUseCase,
        { provide: LoggerPort, useValue: MockLoggerPort },
        { provide: DatabasePort, useValue: MockDatabasePort },
        { provide: PasswordPort, useValue: PasswordAdapter },
      ],
    }).compile();

    useCase = module.get<RegisterNewUserUseCase>(RegisterNewUserUseCase);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });
});
