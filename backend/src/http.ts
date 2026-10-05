import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
export class HttpError extends Error {
  constructor(public status: number, message: string, public code = "ERROR") { super(message); }
}
export const errorHandler: ErrorRequestHandler = (e, _req, res, _next) => {
  if (e instanceof ZodError) return res.status(400).json({ message: "Datos inválidos: " + e.issues.map((i) => i.path.join(".")).join(", "), code: "VALIDATION" });
  if (e instanceof HttpError) return res.status(e.status).json({ message: e.message, code: e.code });
  if (e?.code === "P2002") return res.status(409).json({ message: "Ya existe un registro con ese valor único", code: "DUPLICATE" });
  if (e?.code === "P2025") return res.status(404).json({ message: "No encontrado", code: "NOT_FOUND" });
  console.error(e);
  res.status(500).json({ message: "Error del servidor", code: "INTERNAL" });
};
