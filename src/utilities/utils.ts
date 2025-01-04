import { Request, response, Response } from "express";
import Users from "../models/userModel"

export const pagination = (req: Request) => {
  const page = Number(req.query.page) * 1 || 1;
  const limit = Number(req.query.limit) * 1 || 10;
  const skip = limit * (page - 1);

  return { page, limit, skip };
};





export const capitalizeEachWord = (str?: string) => {
  if (!str) return '';
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

