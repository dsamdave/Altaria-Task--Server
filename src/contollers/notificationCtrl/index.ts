import { Response } from "express";
import { IReqAuth } from "../../types/express";
import { createNotification } from "../../helpers/notification";
import Notification from "../../models/notificationsModel"


const notificationCtrl = {
    createNotification: async(req: IReqAuth, res: Response)=>{

        if (!req.user)
            return res.status(401).json({ message: "Invalid Authentication." });
      

        const { title, message, type, recipientId, recipientRole, data } = req.body;

        try {

            const notification = await createNotification({
                title,
                message,
                type,
                recipientId: req.user?.id,
                recipientRole,
                data,
              });

              if (!notification) {
                return res.status(500).json({ message: 'Failed to create notification' });
              }

              res.status(201).json({ message: 'Notification created successfully', notification });

            
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
          }
    },

    getNotification: async(req: IReqAuth, res: Response)=>{

        if (!req.user)
            return res.status(401).json({ message: "Invalid Authentication." });

        try {

            const notifications = await Notification.find({ recipientId: req.user?.id }).sort({ createdAt: -1 });

            res.status(200).json({ 
                message: "Successful",
                notifications 
            });

        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
          }
    },
}


export default notificationCtrl