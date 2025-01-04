import { Socket, Server } from "socket.io";
// import { IUser } from './interface';
import { io } from "../index";

import { startOfWeek, isSameWeek } from "date-fns";

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

  socket.on("joinRoom", (userID: string) => {
    socket.join(userID);
    console.log(`User ${socket.id} joined room ${userID}`);
    // addClient(socket);
    // console.log({ joinChat: (socket as any).adapter.rooms });
  });

  // notification
  socket.on("sendnotification", (notification) => {
    // Emit the notification to all connected clients
    io.emit("notification", notification);
  });

  // socket.on(
  //   "chatMessage",
  //   async ({
  //     sender,
  //     recipient,
  //     patientID,
  //     doctorID,
  //     message,
  //     attachments,
  //     links,
  //   }) => {
  //     try {
  //       let conversation = await Conversations.findOne({
  //         participants: { $all: [patientID, doctorID] },
  //       }).sort({ lastMessageTime: -1 });

  //       if (conversation?.closed === true) {
  //         io.to(patientID).emit("chatClosed", conversation);
  //         return;
  //       }

  //       const currentDate = new Date();

  //       if (
  //         conversation &&
  //         isSameWeek(conversation.lastMessageTime, currentDate)
  //       ) {
  //         conversation.lastMessage = message;
  //         conversation.lastMessageTime = currentDate;
  //         conversation.doctor = doctorID;
  //         conversation.patient = patientID;
  //         conversation.sender = sender;
  //         conversation.recipient = recipient;
  //         await conversation.save();
  //       } else {
  //         conversation = new Conversations({
  //           participants: [patientID, doctorID],
  //           lastMessage: message,
  //           lastMessageTime: currentDate,
  //           doctor: doctorID,
  //           patient: patientID,
  //           recipient,
  //           sender,
  //         });
  //         await conversation.save();
  //       }

  //       const newMessage = new Messages({
  //         patientID,
  //         doctorID,
  //         message,
  //         attachments,
  //         links,
  //         conversationID: conversation._id,
  //         sender,
  //         recipient,
  //         doctor: doctorID,
  //         patient: patientID,
  //       });

  //       await newMessage.save();

  //       io.to(patientID).emit("newMessage", newMessage);
  //       io.to(doctorID).emit("newMessage", newMessage);

  //       socket.emit("messageDelivered", newMessage._id);
  //     } catch (err) {
  //       console.error("Error saving chat message:", err);
  //     }
  //   }
  // );

  // Retrieve chat history

  // socket.on("getChatsHistoryAdmin", async ({ userID }) => {
  //   try {
  //     const conversations = await Conversations.find()
  //       .sort({ lastMessageTime: -1 })
  //       .populate("doctor")
  //       .populate("patient");

  //     // Emit to the room with the user's ID
  //     io.to(userID).emit("conversationHistoryAdmin", conversations);
  //   } catch (error) {
  //     console.error("Error fetching conversations:", error);

  //     io.to(userID).emit("conversationHistoryErrorAdmin", {
  //       message: "Failed to fetch conversations",
  //     });
  //   }
  // });

  // socket.on("closeChat", async ({ conversationID, userID }) => {
  //   try {
  //     const conversation = await Conversations.findByIdAndUpdate(
  //       conversationID,
  //       { closed: true },
  //       { new: true }
  //     );

  //     // Emit to the room with the user's ID
  //     io.to(userID).emit("chatClosed", conversation);
  //   } catch (error) {
  //     io.to(userID).emit("closingChatError", {
  //       message: "Failed to close chat",
  //     });
  //   }
  // });

  // socket.on("getChatsHistory", async ({ userID }) => {
  //   try {
  //     const conversations = await Conversations.find({
  //       // participants: "66ede5a622950de08dae5fef",
  //       participants: userID,
  //     })
  //       .sort({ lastMessageTime: -1 })
  //       .populate("doctor")
  //       .populate("patient");
  //     // console.log({conversations});

  //     // Emit to the room with the user's ID
  //     io.to(userID).emit("conversationHistory", conversations);
  //   } catch (error) {
  //     console.error("Error fetching conversations:", error);

  //     io.to(userID).emit("conversationHistoryError", {
  //       message: "Failed to fetch conversations",
  //     });
  //   }
  // });

  // socket.on("getChats", async ({ conversationID, userID }) => {
  //   try {
  //     const messages = await Messages.find({
  //       conversationID,
  //     })
  //       .sort({ timestamp: 1 })
  //       .populate("doctor")
  //       .populate("patient");

  //     io.to(userID).emit("chatMessages", messages);
  //   } catch (error) {
  //     console.error("Error fetching messages:", error);

  //     io.to(userID).emit("chatMessagesError", {
  //       message: "Failed to fetch messages",
  //     });
  //   }
  // });

  socket.on("typing", (userID) => {
    io.to(userID).emit("typing", userID);
  });

  socket.on("stopTyping", (userID) => {
    io.to(userID).emit("stopTyping", userID);
  });

  // WebRTC signaling events for audio/video calls
  socket.on("callUser", ({ signalData, recipientId, from, callType }) => {
    io.to(recipientId).emit("incomingCall", {
      signal: signalData,
      from,
      callType,
    });
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
