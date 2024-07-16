import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "../routes";
import passport from 'passport';

// Import the passport configuration
import '../config/passport';

export default async (app: Application) => {
  // Middleware
  app.use(cors()); // Enable CORS for all origins

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(morgan("dev"));
  app.use(cookieParser());
  app.use(passport.initialize());

  // Routes
  app.use("/api", routes);

  app.get("/api", (req, res) => {
    res.status(200).json({
      message: "Welcome to Med-Tele Healthcare server",
      "The Med-Tele Healthcare-api": "A Healthcare Application",
    });
  });

  // 404 Error handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Sorry, this endpoint does not exist yet!" });
  });

  return app;
};
