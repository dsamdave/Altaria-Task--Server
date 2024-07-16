import dotenv from "dotenv";
dotenv.config();
import express from "express";
import ExpressApp from "./app/ExpressApp";
import mongoose from "mongoose";

import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { SocketServer } from "./config/socket";

const app = express();

const URI = process.env.MONGODB_URI;

if (!URI) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

ExpressApp(app);

// Socket.io

// Store connected clients
const clients = new Set<Socket>();

const http = createServer(app);
export const io = new Server(http, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST'],
  },
});

io.on("connection", (socket: Socket) => {
  SocketServer(socket);
  clients.add(socket);
  console.log(`"someone connected!" ${socket.id}`);
});

// server listenning
const PORT = process.env.PORT || 8000;

const connectDB = async () => {
  try {
    await mongoose.connect(URI, {});
    console.log("MongoDB Connected...");

    http.listen(PORT, () => {
      console.log(`Server listening on port: ${PORT}`);
    });
  } catch (error) {
    console.log("MongoDB unable to Connect...");
    console.error(error); // Improved error logging
    process.exit(1); // Exit process with failure
  }
};

connectDB();
