import { Socket, Server } from "socket.io";
// import { IUser } from './interface';
import Chat from "../models/chatModel";
import { io } from "../index";
import Conversations from "../models/messageModel/conversationModel";
import Messages from "../models/messageModel";
import { startOfWeek, isSameWeek } from 'date-fns';


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








  
  socket.on("chatMessage", async ({ patientID, doctorID, message, attachments, links }) => {
    try {
      // Find or create the conversation
      let conversation = await Conversations.findOne({
        participants: { $all: [patientID, doctorID] },
      }).sort({ lastMessageTime: -1 });
  
      const currentDate = new Date();
  
      if (conversation) {
        // Update last message and time
        conversation.lastMessage = message;
        conversation.lastMessageTime = currentDate;
        await conversation.save();
      } else {
        // Create a new conversation if it doesn't exist
        conversation = new Conversations({
          participants: [patientID, doctorID],
          lastMessage: message,
          lastMessageTime: currentDate,
        });
        await conversation.save();
      }
  
      // Create a new message
      const newMessage = new Messages({
        patientID,
        doctorID,
        message,
        attachments,
        links,
        conversationID: conversation._id,
      });
  
      await newMessage.save();
  
      // Emit to both sender and recipient
      io.to(patientID).emit("newMessage", 
      //   {
      //   doctorID,
      //   message,
      //   attachments,
      //   links,
      //   conversationID: conversation._id,
      //   timestamp: newMessage.createdAt,
      // }
      newMessage
    );
      io.to(doctorID).emit("newMessage", 
      //   {
      //   patientID,
      //   message,
      //   attachments,
      //   links,
      //   conversationID: conversation._id,
      //   timestamp: newMessage.createdAt,
      // }
      newMessage
    );
  
      socket.emit("messageDelivered", newMessage._id);
    } catch (err) {
      console.error("Error saving chat message:", err);
    }
  });
  



  // Retrieve chat history

  socket.on("getChats", async ({ userId, recipientId, limit = 20, skip = 0 }) => {
    const chats = await Messages.find({
      $or: [
        { patientID: userId, doctorID: recipientId },
        { patientID: recipientId, doctorID: userId },
      ],
    })
    .sort({ createdAt: 1 }) 
    .limit(limit)
    .skip(skip);
  
    socket.emit("chatHistory", chats);
  });



  socket.on('typing', (roomId: string, userId: string) => {
    socket.to(roomId).emit('typing', userId);
  });
  
  socket.on('stopTyping', (roomId: string, userId: string) => {
    socket.to(roomId).emit('stopTyping', userId);
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
