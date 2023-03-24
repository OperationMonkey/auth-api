import { UnauthorizedException } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";

/**
 * @todo we will extract JWT here and pass it to controller
 */
export async function authorize(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const foo = await Promise.resolve(req.headers);

  const bar = Math.floor(Math.random() * 3);

  if (bar > 1) {
    next(new UnauthorizedException("Back luck"));
  }

  console.log(foo);
  next();
}
