import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "./http";
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const t = req.headers.authorization?.replace("Bearer ", "") ?? "";
  try { jwt.verify(t, process.env.JWT_SECRET!); next(); }
  catch { next(new HttpError(401, "Sesión no válida. Inicia sesión de nuevo.", "UNAUTHORIZED")); }
}
