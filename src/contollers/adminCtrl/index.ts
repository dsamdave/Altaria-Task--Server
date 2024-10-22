import { Request, response, Response, NextFunction } from "express";
import { IReqAuth } from "../../types/express";
import Users from "../../models/userModel";
import { pagination } from "../../utilities/utils";
import Appointments from "../../models/appointment";
import FreeHealthQues from "../../models/freeHealthQuesModel";

const adminCtrl = {
  getAnalytics: async (req: IReqAuth, res: Response) => {
    try {
      const totalPatients = await Users.countDocuments({ role: "user" });

      const totalDoctors = await Users.countDocuments({
        role: { $in: ["admin", "moderator"] },
      });

      const totalAppointments = await Appointments.countDocuments();

      const totalFreeHealthQuestions = await FreeHealthQues.countDocuments();

      res.status(200).json({
        message: "Successful",
        details: {
          totalDoctors,
          totalPatients,
          totalAppointments,
          totalFreeHealthQuestions,
        },
      });
    } catch (error) {
      res.status(400).json({ message: "Error fetching analytics" });
    }
  },
};

export default adminCtrl;
