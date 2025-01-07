import { Response } from "express";

interface ResPayload {
  status?: boolean;
  message?: string;
  statusCode?: number;
  data?: unknown;
}

export const sendResponse = (res: Response, payload: ResPayload) => {
  const response = {
    status: payload.status ?? false,
    message: payload.message,
    data: payload.data ?? null,
  };
  return res.status(payload.statusCode ?? 200).json(response);
};

export const handleServerError = (res: Response, error: unknown) => {
  const message =
    error instanceof Error ? error.message : "An unknown error occurred.";
  res.status(500).json({ status: false, message, data: null });
};
