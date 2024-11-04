import { Request, response, Response, NextFunction } from "express";
import { IReqAuth } from "../../types/express";
import Users from "../../models/userModel";
import { capitalizeEachWord, pagination } from "../../utilities/utils";
import Appointments from "../../models/appointment";
import WaitList from "../../models/comingSoonModel";
import FreeHealthQues from "../../models/freeHealthQuesModel";

const XLSX = require("xlsx");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

interface MonthlyCount {
  month: string;
  totalAccepted: number;
  totalDeclined: number;
  totalConcluded: number;
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
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
        concluded: Record<number, number>;
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
          if (!acc.concluded[monthIndex]) {
            acc.concluded[monthIndex] = 0;
          }

          // Count based on status
          if (appointment.status === "Concluded") {
            acc.concluded[monthIndex] += 1;
          } else if (appointment.status === "Declined") {
            acc.declined[monthIndex] += 1;
          } else if (appointment.status === "Accepted") {
            acc.accepted[monthIndex] += 1;
          }

          return acc;
        },
        { accepted: {}, declined: {}, concluded: {} }
      );

      const labels: string[] = [];
      const acceptedCounts: number[] = [];
      const declinedCounts: number[] = [];
      const concludedCounts: number[] = [];

      for (let i = 0; i < 12; i++) {
        if (
          result.accepted[i] !== undefined ||
          result.declined[i] !== undefined ||
          result.concluded[i] !== undefined
        ) {
          labels.push(monthNames[i]);
          acceptedCounts.push(result.accepted[i] || 0);
          declinedCounts.push(result.declined[i] || 0);
          concludedCounts.push(result.concluded[i] || 0);
        }
      }

      res.status(200).json({
        message: "Successful",
        details: {
          appointments: {
            labels,
            acceptedCounts,
            declinedCounts,
            concludedCounts,
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

  exportWaitLIst: async (req: IReqAuth, res: Response) => {
    try {
      const waitlistUsers = await WaitList.find().lean();

      const worksheetWaitListUsers = waitlistUsers.map((each) => ({
        "Full Name": capitalizeEachWord(each?.fullName),
        Email: capitalizeEachWord(each?.email),
        "Phone Number": each?.phoneNumber,
        Location: capitalizeEachWord(each?.location),
      }));

      // Create a new workbook and add the worksheets
      const workbook = XLSX.utils.book_new();
      const worksheetWithWaitList = XLSX.utils.json_to_sheet(
        worksheetWaitListUsers
      );

      XLSX.utils.book_append_sheet(
        workbook,
        worksheetWithWaitList,
        "Waitlist Details"
      );

      // Generate Excel file buffer
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "buffer",
      });

      // Write the Excel file to a temporary location
      const tempFilePath = path.join(__dirname, "users.xlsx");
      fs.writeFileSync(tempFilePath, excelBuffer);

      // Email configuration
      let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: `${process.env.ADMIN_EMAIL}`,
          pass: `${process.env.ADMIN_EMAIL_PASSWORD}`,
        },
      });

      const mailOptions = {
        from: `"ExpatDoc Online" <${process.env.ADMIN_EMAIL}>`,
        to: `${process.env.ADMIN_EMAIL}`,
        // to: `${admin.email}`,
        subject: "WaitList Data Export",
        text: "Attached is the Excel file containing Waitlist details.",
        attachments: [
          {
            filename: "waitlistdetails.xlsx",
            path: tempFilePath,
          },
        ],
      };

      // Send the email
      await mailTransporter.sendMail(mailOptions);

      // Remove the temporary Excel file
      fs.unlinkSync(tempFilePath);
      console.log("Temporary file deleted");

      return res.status(200).json({
        message: "Successful",
      });
      // console.log("Temporary file deleted");
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },
};

export default adminCtrl;
