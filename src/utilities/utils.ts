import { Request  } from "express";

export const pagination = (req: Request) => {
  const page = Number(req.query.page) * 1 || 1;
  const limit = Number(req.query.limit) * 1 || 10;
  const skip = limit * (page - 1);

  return { page, limit, skip };
};





