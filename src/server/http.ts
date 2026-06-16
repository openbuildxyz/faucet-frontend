import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";
import { getAllowedOrigins } from "./env";

export type ApiResponse<T = unknown> = {
  code: number;
  message: string;
  data?: T;
};

export function applyCors(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();

  if (origin && (allowedOrigins.length === 0 || allowedOrigins.includes(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
}

export function ok<T>(res: NextApiResponse<ApiResponse<T>>, data: T) {
  return res.status(200).json({
    code: 200,
    message: "success",
    data,
  });
}

export function fail(
  res: NextApiResponse<ApiResponse>,
  status: number,
  message: string,
) {
  return res.status(status).json({
    code: status,
    message,
  });
}

export function methodNotAllowed(res: NextApiResponse<ApiResponse>) {
  return fail(res, 405, "Method not allowed");
}

export function handleApiError(res: NextApiResponse<ApiResponse>, error: unknown) {
  if (error instanceof ZodError) {
    return fail(res, 400, "Invalid request. Please try again later.");
  }

  console.error(error);
  return fail(res, 500, "The system is currently busy. Please try again later.");
}
