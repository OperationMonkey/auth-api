import type { NestMiddleware } from "@nestjs/common";
import { Inject, Injectable } from "@nestjs/common";

import type { NextFunction, Request, Response } from "express";

import { ConfigPort } from "../../core/ports/config.port";

@Injectable()
export class AuthorizeAdmin implements NestMiddleware<Request, Response> {
  public constructor(@Inject(ConfigPort) private readonly config: ConfigPort) {}

  public use(req: Request, res: Response, next: NextFunction): void {
    console.log("Admin authorizer");
    next();
  }
}
