import { Test } from "@nestjs/testing";

import { PasswordAdapter } from "../../../src/adapters/password.adapter";
import { DatabaseException } from "../../../src/core/exceptions/database.error";
import { InvalidPasswordException } from "../../../src/core/exceptions/invalid-password.error";
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
        { provide: PasswordPort, useClass: PasswordAdapter },
      ],
    }).compile();

    useCase = module.get<RegisterNewUserUseCase>(RegisterNewUserUseCase);
    jest.clearAllMocks();
  });

  it("should register a valid user", async () => {
    const mockAddUser = jest.spyOn(MockDatabasePort.users, "addUser").mockResolvedValueOnce({
      id: "69e05f14-6508-4a1a-af3f-88fc5d20c1ba",
      username: "username",
      name: "Real Name",
      email: "user@example.com",
      admin: false,
      locked: false,
      deleted: false,
      createdOn: new Date("2023-04-14T18:19:09.269Z"),
      modifiedOn: new Date("2023-04-14T18:19:09.269Z"),
    });

    const user = await useCase.register(
      "username",
      "Real Name",
      "user@example.com",
      "Foobar",
      "Foobar"
    );

    expect(mockAddUser).toHaveBeenCalledWith(
      "username",
      expect.any(String),
      "Real Name",
      "user@example.com"
    );
    expect(user).toEqual({
      id: "69e05f14-6508-4a1a-af3f-88fc5d20c1ba",
      username: "username",
      name: "Real Name",
      email: "user@example.com",
      admin: false,
      locked: false,
      deleted: false,
      createdOn: new Date("2023-04-14T18:19:09.269Z"),
      modifiedOn: new Date("2023-04-14T18:19:09.269Z"),
    });
  });

  it("Should throw InvalidPasswordException if password mismatch", async () => {
    const mockAddUser = jest.spyOn(MockDatabasePort.users, "addUser");

    await expect(
      useCase.register("username", "Real Name", "user@example.com", "Foobar", "Barfoo")
    ).rejects.toThrow(InvalidPasswordException);

    expect(mockAddUser).not.toHaveBeenCalled();
  });

  it("should re-throw DatabaseExceptions", async () => {
    jest.spyOn(MockDatabasePort.users, "addUser").mockImplementationOnce(() => {
      throw new DatabaseException("Database error");
    });

    await expect(
      useCase.register("username", "Real Name", "user@example.com", "Foobar", "Foobar")
    ).rejects.toThrow(DatabaseException);
  });
});
