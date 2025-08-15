import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "../routes";

export default async (app: Application) => {
  app.use(cors());

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(morgan("dev"));
  app.use(cookieParser());

  app.use("/api", routes);

  app.get("/api", (req, res) => {
    res.status(200).json({
      status: true,
      message: "Welcome to My SmartHub server",
      "The Student Pratice Server": "A Server for students to test their web application.",
      data: null,
    });
  });

  app.use((req: Request, res: Response) => {
    res
      .status(404)
      .json({
        status: false,
        message: "Sorry, this endpoint does not exist yet!",
        data: null,
      });
  });

  return app;
};
