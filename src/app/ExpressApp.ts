import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "../routes";


export default async (app: Application) => {
  // Middleware
  app.use(cors());  

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(morgan("dev"));
  app.use(cookieParser());


  // Routes
  app.use("/api", routes);

  app.get("/api", (req, res) => {
    res.status(200).json({
      message: "Welcome to Leira Health server",
      "The Leira Healthcare-api": "A Healthcare Application",
    });
  });

  // 404 Error handler
  app.use((req: Request, res: Response ) => {
    res.status(404).json({ message: "Sorry, this endpoint does not exist yet!" });
  });

  return app;
};
