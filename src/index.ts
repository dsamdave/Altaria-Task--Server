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


const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST'],
  },
});

// Handle Socket Connections
io.on("connection", (socket: Socket) => {
    SocketServer(socket, io);
});

// server listenning
const PORT = process.env.PORT || 8082;

const connectDB = async () => {
  try {
    await mongoose.connect(URI, {});
    console.log("MongoDB Connected...");

    httpServer.listen(PORT, () => {
      console.log(`Server listening on port: ${PORT}`);
    });
  } catch (error) {
    console.log("MongoDB unable to Connect...");
    console.error(error); 
    process.exit(1);  
  }
};

connectDB();
