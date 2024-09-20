import { Request, response, Response, NextFunction } from "express";
import { IReqAuth } from "../../types/express";
import { checkPatientType, pagination } from "../../utilities/utils";
// import Appointments from "../../models/appointment";
import Users from "../../models/userModel";
import Appointments from "../../models/appointment";

const appointmentCtrl = {
  getAllAppointments: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.admin && !req.user && !req.moderator && !req.doctor)
        return res.status(401).json({ message: "Invalid Authentication."});

      const { limit, skip, page } = pagination(req);

      const appointments = await Appointments.find()
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })
        .populate("user");

      return res.status(200).json({
        message: "Successful",
        page,
        count: appointments.length,
        appointments,
      });
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: "Error retrieving appointments", error: err.message });
    }
  },
  getOneAppointment: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.admin && !req.user && !req.moderator && !req.doctor)
        return res.status(401).json({ message: "Invalid Authentication." });

      const appointment = await Appointments.findById(req.params.id).populate("user")

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      } else {
        return res.status(200).json({
          message: "Successful",
          appointment,
        });
      }
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: "Error retrieving appointment", error: err.message });
    }
  },
  getUserAppointments: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.user)
        return res.status(401).json({ message: "Invalid Authentication." });

      const { limit, skip, page } = pagination(req);

      const appointments = await Appointments.find({
        $or: [
          { user: req.user.id },
          { patientID: req.user.patientID },
        ],
      })
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

      return res.status(200).json({
        message: "Successful",
        page,
        count: appointments.length,
        appointments,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },

  bookAppointment: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Invalid Authentication." });
      }
  
      const { id, patientID } = req.user;
  
      const patientType = await checkPatientType(id);
  
      const { forSomeOne, firstName, lastName, gender, phone, dOB, ...rest } = req.body;
  
      const appointmentData = {
        ...rest,
        patientType,
        user: id,
        patientID,
        forSomeOne,
        someOneDetails: forSomeOne
          ? {
              patientName: `${firstName} ${lastName}`,
              firstName,
              gender,
              lastName,
              phone,
              dOB
            }
          : undefined  
      };
  
      const savedAppointment = new Appointments(appointmentData);
      await savedAppointment.save();
  
      await Users.findByIdAndUpdate(id, {
        $push: { "patientInfo.appointments": savedAppointment._id },
      });
  
      return res.status(200).json({
        message: "Successful",
        appointment: savedAppointment,
      });
    } catch (err: any) {
      return res.status(500).json({ message: "Error booking appointment", error: err.message });
    }
  },
  

  acceptAppointment: async (
    req: IReqAuth,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.admin && !req.moderator && !req.doctor)
        return res.status(401).json({ message: "Invalid Authentication." });

      console.log(req.admin, req.moderator, req.doctor)

      const appointment = await Appointments.findByIdAndUpdate(
        req.params.id,
        { status: "Accepted" },
        { new: true }
      );

      res.status(201).json({
        message: "Successful",
        appointment,
      });
    } catch (err: any) {
      res
        .status(500)
        .json({ message: "Error accepting appointment", error: err.message });
    }
  },

  declineAppointment: async (
    req: IReqAuth,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.admin && !req.moderator && !req.doctor)
        return res.status(401).json({ message: "Invalid Authentication." });

      const appointment = await Appointments.findByIdAndUpdate(
        req.params.id,
        { status: "Declined" },
        { new: true }
      );

      res.status(201).json({
        message: "Successful",
        appointment,
      });
    } catch (err: any) {
      res
        .status(500)
        .json({ message: "Error declining appointment", error: err.message });
    }
  },

  getAppointmentsByStatus: async (
    req: IReqAuth,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { status } = req.params;

      const validStatuses = ["Pending", "Accepted", "Declined", "Concluded"];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status provided" });
      }

      const appointments = await Appointments.find({ status });

      res.status(201).json({
        message: "Successful",
        appointments,
      });
    } catch (err: any) {
      res
        .status(500)
        .json({
          message: `Error retrieving ${status.toLowerCase()} appointments`,
          error: err.message,
        });
    }
  },

  deleteAppointment: async (
    req: IReqAuth,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.admin && !req.moderator && !req.doctor)
        return res.status(401).json({ message: "Invalid Authentication." });

      await Appointments.findByIdAndDelete(req.params.id);

      res.status(201).json({
        message: "Successful",
      });
    } catch (err: any) {
      res
        .status(500)
        .json({ message: "Error deleting appointment", error: err.message });
    }
  },

  updateAppointmentStatus: async (
    req: IReqAuth,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { status } = req.body;

      if (!["Pending", "Accepted", "Declined", "Concluded"].includes(status)) {
        return res.status(400).json({ message: "Invalid status provided" });
      }

      const appointment = await Appointments.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!appointment) {
        res.status(404).json({ message: "Appointment not found" });
      } else {
        res.status(201).json({
          message: "Successful",
          appointment,
        });
      }
    } catch (err: any) {
      res.status(500).json({ message: "Server error.", error: err.message });
    }
  },

  example: async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
      const { user } = req;

      res.status(201).json({
        message: "Successful",
        user,
      });
    } catch (err: any) {
      res.status(500).json({ message: "Server error.", error: err.message });
    }
  },
};

export default appointmentCtrl;
