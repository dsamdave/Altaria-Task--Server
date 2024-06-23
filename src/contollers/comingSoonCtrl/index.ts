import { Request, response, Response } from "express";

import ComingSoon from "../../models/comingSoonModel";

const comingSoonCtrl = {
  addComingSoonMsg: async (req: Request, res: Response) => {
    try {
      const { fullName, email, phoneNumber, location } = req.body;

      const comingSoonMsg = new ComingSoon({
        fullName,
        email,
        phoneNumber,
        location,
      });

      await comingSoonMsg.save();

      return res.status(200).json({
        message: "Successful",
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },
  
  getAllComingSoonMsg: async (req: Request, res: Response) => {
    try {
      const comingSoonMsgs = await ComingSoon.find().sort({createdAt: -1});

      return res.status(200).json({
        message: "Successful",
        count: comingSoonMsgs.length,
        waitlist: comingSoonMsgs,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },
};

export default comingSoonCtrl;
