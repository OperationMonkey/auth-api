import { Controller, Get, HttpCode, Inject, Post } from "@nestjs/common";

import type { User } from "../core/entities/user";
import { RegisterNewUserUseCase } from "../core/use-cases/register-new-user.use-case";

@Controller({
  path: "users",
  version: "1",
})
export class UserControllerV1 {
  public constructor(
    @Inject(RegisterNewUserUseCase) private readonly registerNewUserUseCase: RegisterNewUserUseCase
  ) {}

  @Post()
  @HttpCode(201)
  public async registerNewUser(): Promise<User> {
    const foo = await this.registerNewUserUseCase.register(
      "username",
      "User Name",
      "user@example.com",
      "password",
      "password"
    );

    return foo;
  }

  @Get("/test")
  @HttpCode(200)
  public tester(): string {
    return "Hello Test";
  }
}
