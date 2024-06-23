import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "../routes";

export default async (app: Application) => {
  // Middleware

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(cors());
  app.use(morgan("dev"));
  app.use(cookieParser());

  app.use((request: Request, response: Response, next: NextFunction) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header(
      "Access-Control-Allow-Methods",
      "PUT, GET, POST, DELETE, OPTIONS"
    );
    response.header("Access-Control-Allow-Credentials", "true");
    response.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Methods, Credentials"
    );
    next();
  });

  // Routes
  app.use("/api", routes);

  app.get("/api", (req, res) => {
    res.status(200).json({
      message: "Welcome to Med-Tele Healthcare server",
      "The Med-Tele Healthcare-api": "A Healthcare Application",
    });
  });

  app.use((request: Request, response: Response, next: NextFunction) => {
    response
      .status(404)
      .json({ message: "Sorry, this endpoint does not exist yet!" });
  });

  return app;
};
