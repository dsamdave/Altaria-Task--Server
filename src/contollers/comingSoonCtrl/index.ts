import { Request, response, Response } from "express";

import ComingSoon from "../../models/comingSoonModel";
import { pagination } from "../../utilities/utils";

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

      const { limit, skip, page } = pagination(req);
      const totalItems = await ComingSoon.countDocuments();


      const comingSoonMsgs = await ComingSoon.find()        
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

      return res.status(200).json({
        message: "Successful",
        page,
        totalItems,
        count: comingSoonMsgs.length,
        waitlist: comingSoonMsgs,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },
};

export default comingSoonCtrl;
