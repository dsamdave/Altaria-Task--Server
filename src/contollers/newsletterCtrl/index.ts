import { Request, response, Response, NextFunction } from "express";
import { IReqAuth } from "../../types/express";
import Users from "../../models/userModel";
import { pagination } from "../../utilities/utils";
import Newsletter from "../../models/newsletterModel";

const newsletterCtrl = {
  subscribe: async (req: IReqAuth, res: Response) => {
    const { email } = req.body;

    try {
      const existingSubscriber = await Newsletter.findOne({ email });
      if (existingSubscriber) {
        return res
          .status(400)
          .json({ message: "Email is already subscribed." });
      }

      const subscriber = new Newsletter({ email });
      await subscriber.save();

      res.status(200).json({
        message: "Successful",
      });
    } catch (error) {
      res.status(400).json({ message: "Error fetching analytics" });
    }
  },

  unsubscribe: async (req: IReqAuth, res: Response) => {
    const { email } = req.body;

    try {
      const subscriber = await Newsletter.findOneAndDelete({ email });
      if (!subscriber) {
        return res
          .status(404)
          .json({ message: "Email not found in the subscription list." });
      }

      res.status(200).json({
        message: "Successful",
      });
    } catch (error) {
      res.status(400).json({ message: "Error fetching analytics" });
    }
  },
  getAllSubscribers: async (req: IReqAuth, res: Response) => {
    const { email } = req.body;

    try {
        const subscribers = await Newsletter.find();

      res.status(200).json({
        message: "Successful",
        newsletterSubscribers: subscribers
      });
    } catch (error) {
      res.status(400).json({ message: "Error fetching analytics" });
    }
  },
};

export default newsletterCtrl;
