import { Request, response, Response, NextFunction } from "express";
import { IReqAuth } from "../../types/express";
import Conversations from "../../models/messageModel/conversationModel";
import Messages from "../../models/messageModel";
import { startOfWeek, isSameWeek } from 'date-fns';


 
const messageCtrl = {
  addMessage: async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
      if (!req.admin && !req.user && !req.doctor) {
        return res.status(401).json({ message: "Invalid Authentication." });
      }
  
      const { patientID, doctorID, message, attachments, links } = req.body;
  

      let conversation = await Conversations.findOne({
        participants: { $all: [patientID, doctorID] },
      }).sort({ lastMessageTime: -1 }); 
  
      const currentDate = new Date();
  
      if (conversation && isSameWeek(conversation.lastMessageTime, currentDate)) {

        conversation.lastMessage = message;
        conversation.lastMessageTime = currentDate;
        conversation.doctor = doctorID;
        conversation.patient = patientID;
        await conversation.save();
      } else {

        conversation = new Conversations({
          participants: [patientID, doctorID],
          lastMessage: message,
          lastMessageTime: currentDate,
          doctor: doctorID,
          patient: patientID
        });
        await conversation.save();
      }
  

      const newMessage = new Messages({
        patientID,
        doctorID,
        message,
        attachments,
        links,
        conversationID: conversation._id,
      });
  
      await newMessage.save();
  
      res.status(201).json({
        message: "Successful",
        newMessage,
      });
    } catch (err: any) {
      res.status(500).json({ message: "Server error.", error: err.message });
    }
  },

  getConversations: async (
    req: IReqAuth,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.admin && !req.user && !req.doctor)
        return res.status(401).json({ message: "Invalid Authentication." });
  
      const { userID } = req.params;
  
      // Fetch conversations for the user, sorted by the most recent message time
      const conversations = await Conversations.find({
        participants: userID,
      }).sort({ lastMessageTime: -1 });
  
      res.status(200).json({
        message: "Successful",
        conversations,
      });
    } catch (err: any) {
      res.status(500).json({ message: "Server error.", error: err.message });
    }
  },

  getMessages: async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
      if (!req.admin && !req.user && !req.doctor)
        return res.status(401).json({ message: "Invalid Authentication." });
  
      const { conversationID } = req.params;
  

      const messages = await Messages.find({
        conversationID,
      }).sort({ timestamp: 1 });
  
      res.status(200).json({
        message: "Successful",
        messages,
      });
    } catch (err: any) {
      res.status(500).json({ message: "Server error.", error: err.message });
    }
  },

  example: async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
      if (!req.admin && !req.user && !req.doctor)
        return res.status(401).json({ message: "Invalid Authentication." });

      res.status(201).json({
        message: "Successful",
      });
    } catch (err: any) {
      res.status(500).json({ message: "Server error.", error: err.message });
    }
  },
};

export default messageCtrl;
