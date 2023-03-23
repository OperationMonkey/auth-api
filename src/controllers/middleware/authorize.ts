import type { NextFunction, Request, Response } from "express";

export function authorize(_req: Request, _res: Response, next: NextFunction): void {
  console.log("authorize middleware");
  next();
}
