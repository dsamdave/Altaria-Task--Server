import { Socket, Server } from "socket.io";
// import { IUser } from './interface';
import Chat from "../models/chatModel";
import { io } from "../index";

export interface ISocketUser {
  id: string;
  socketId: string;
}

// Manage connected clients
const clients = new Map<string, Socket>();

// Add client to the set
const addClient = (socket: Socket) => {
  clients.set(socket.id, socket);
};

// Remove client from the set
const removeClient = (socket: Socket) => {
  clients.delete(socket.id);
};

export const SocketServer = (socket: Socket, io: Server) => {
  console.log(`User connected: ${socket.id}`);

  // Handle joining users to rooms

  socket.on("joinRoom", (roomId: string) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    // addClient(socket);
    // console.log({ joinChat: (socket as any).adapter.rooms });
  });



  // notification
  socket.on("sendnotification", (notification) => {
    // Emit the notification to all connected clients
    io.emit("notification", notification);
  });



  // Chat message event
  socket.on("chatMessage", async ({ sender, recipient, message }) => {
    const newMessage = new Chat({ sender, recipient, message });
    await newMessage.save();

    io.to(recipient).emit("newMessage", { sender, message });
  });

  // Retrieve chat history
  socket.on("getChats", async ({ userId, recipientId }) => {
    const chats = await Chat.find({
      $or: [
        { sender: userId, recipient: recipientId },
        { sender: recipientId, recipient: userId },
      ],
    }).sort({ timestamp: 1 });

    socket.emit("chatHistory", chats);
  });



  socket.on('typing', (roomId: string) => {
    socket.to(roomId).emit('typing', socket.id);
  });

  socket.on('stopTyping', (roomId: string) => {
    socket.to(roomId).emit('stopTyping', socket.id);
  });




  // WebRTC signaling events for audio/video calls
  socket.on("callUser", ({ signalData, recipientId, from, callType }) => {
    io.to(recipientId).emit("incomingCall", { signal: signalData, from, callType });
  });

  socket.on("acceptCall", ({ signalData, to }) => {
    io.to(to).emit("callAccepted", signalData);
  });

  socket.on("iceCandidate", ({ candidate, recipientId }) => {
    io.to(recipientId).emit("iceCandidate", candidate);
  });

  socket.on("endCall", ({ recipientId }) => {
    io.to(recipientId).emit("callEnded");
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
};
