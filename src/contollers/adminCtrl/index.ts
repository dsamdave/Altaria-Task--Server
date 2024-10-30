import { Request, response, Response, NextFunction } from "express";
import { IReqAuth } from "../../types/express";
import Users from "../../models/userModel";
import { pagination } from "../../utilities/utils";
import Appointments from "../../models/appointment";
import FreeHealthQues from "../../models/freeHealthQuesModel";

interface MonthlyCount {
  month: string;
  totalAccepted: number;
  totalDeclined: number;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];



const adminCtrl = {
  getAnalytics: async (req: IReqAuth, res: Response) => {
    try {
      const totalPatients = await Users.countDocuments({ role: "user" });

      const totalDoctors = await Users.countDocuments({
        role: { $in: ["admin", "moderator"] },
      });

      const totalAppointments = await Appointments.countDocuments();
      
      const totalFreeHealthQuestions = await FreeHealthQues.countDocuments();

      const appointments = await Appointments.find();


      const getMonthIndex = (date: string): number => {
        const d = new Date(date);
        return d.getMonth(); // Returns zero-based index for the month
      };

      const result = appointments.reduce<{
        accepted: Record<number, number>;
        declined: Record<number, number>;
      }>(
        (acc, appointment) => {
          const monthIndex = getMonthIndex(appointment.createdAt);
      
          // Initialize counts for the month if not already present
          if (!acc.accepted[monthIndex]) {
            acc.accepted[monthIndex] = 0;
          }
          if (!acc.declined[monthIndex]) {
            acc.declined[monthIndex] = 0;
          }
      
          // Count based on status
          if (appointment.status === "Concluded") {
            acc.accepted[monthIndex] += 1;
          } else if ( appointment.status === "Declined") {
            acc.declined[monthIndex] += 1;
          }
      
          return acc;
        },
        { accepted: {}, declined: {} }
      );



      const labels: string[] = [];
      const acceptedCounts: number[] = [];
      const declinedCounts: number[] = [];

      for (let i = 0; i < 12; i++) {
        if (result.accepted[i] !== undefined || result.declined[i] !== undefined) {
          labels.push(monthNames[i]);
          acceptedCounts.push(result.accepted[i] || 0);
          declinedCounts.push(result.declined[i] || 0);
        }
      }


      res.status(200).json({
        message: "Successful",
        details: {
          appointments: {
            labels, acceptedCounts, declinedCounts
          },
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
