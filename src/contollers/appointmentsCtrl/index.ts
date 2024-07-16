import { Request, response, Response, NextFunction } from "express";
import { IReqAuth } from "../../types/express";
import { pagination } from "../../utilities/utils";
import Appointments from "../../models/appointment";



const appointmentCtrl = {

  getAllAppointments: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.admin && !req.user)
        return res.status(401).json({ message: "Invalid Authentication." });

      const { limit, skip, page } = pagination(req);

      const appointments = await Appointments.find()
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
  getOneAppointment: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.user && !req.admin)
        return res.status(401).json({ message: "Invalid Authentication." });

      const { id} = req.params;

      const appointment = await Appointments.findById(id)

      return res.status(200).json({
        message: "Successful",
        appointment
      })

    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }

  },
  getUserAppointments: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.user)
        return res.status(401).json({ message: "Invalid Authentication." });

      const { limit, skip, page } = pagination(req);

      const appointments = await Appointments.find({
        $or: [{ patientEmail: req.user.email }, { patientPhoneNumber: req.user.phoneNumber }],
      }).limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

      return res.status(200).json({
        message: "Successful",
        page,
        count: appointments.length,
        appointments,
      })

    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }

  },

  bookAppointment: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.user)
        return res.status(401).json({ message: "Invalid Authentication." });

      const {     doctor,
        patientName,
        patientEmail,
        patientPhoneNumber,
        appointmentDate,
        reason, } = req.body;

      const appointment = await Appointments.create({ doctor,
        patientName,
        patientEmail,
        patientPhoneNumber,
        appointmentDate,
        reason })

      return res.status(200).json({
        message: "Successful",
        appointment,
      })

    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }

  },

  example: async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
      const { user } = req;

      res.status(201).json({
        message: "User registered successfully.",
        user,
      });
    } catch (err: any) {
      res.status(500).json({ message: "Server error.", error: err.message });
    }
  },
};


export default appointmentCtrl
