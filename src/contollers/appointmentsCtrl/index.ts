import { Request, response, Response, NextFunction } from "express";
import { IReqAuth } from "../../types/express";
import { checkPatientType, formatDate, pagination } from "../../utilities/utils";
// import Appointments from "../../models/appointment";
import Users from "../../models/userModel";
import Appointments from "../../models/appointment";
import ZoomVariables from "../../models/appointment/ZoomVariablesModel";
import axios from "axios"
import { getZoomMeetingLink } from "../../utilities/zoomIntegration";
import { validEmail } from "../../middleware/validations/authValidations";
import { sendOneOnOneConsultationEMailToDoctor, sendOneOnOneConsultationEMailToUser } from "../../utilities/notificationUtility";
import { createNotification } from "../../helpers/notification";

const appointmentCtrl = {
  getNextAppointmentsAdmin: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.admin && !req.user && !req.moderator && !req.doctor)
        return res.status(401).json({ message: "Invalid Authentication." });

      const { limit, skip, page } = pagination(req);
      const totalItems = await Appointments.countDocuments();


      const today = new Date();
      const appointments = await Appointments.find({
        date: { $gte: today }
      })
        .sort({ date: 1, time: 1 })
        .limit(limit)
        .skip(skip)
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
  getNextAppointments: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.admin && !req.user && !req.moderator && !req.doctor)
        return res.status(401).json({ message: "Invalid Authentication." });

      const { limit, skip, page } = pagination(req);

      const today = new Date();
      const appointments = await Appointments.find({
        date: { $gte: today }, user: req.user.id
      })
        .sort({ date: 1, time: 1 })
        .limit(limit)
        .skip(skip)
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

  getPastAppointments: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.admin && !req.user && !req.moderator && !req.doctor)
        return res.status(401).json({ message: "Invalid Authentication." });

      const { limit, skip, page } = pagination(req);

      const today = new Date();
      const appointments = await Appointments.find({
        date: { $lt: today } , user: req.user.id
      })
        .sort({ date: -1, time: -1 })
        .limit(limit)
        .skip(skip)
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
  getAllAppointments: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.admin && !req.user && !req.moderator && !req.doctor)
        return res.status(401).json({ message: "Invalid Authentication." });

      const { limit, skip, page } = pagination(req);
      const totalItems = await Appointments.countDocuments();

      const appointments = await Appointments.find()
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })
        .populate("user");

      return res.status(200).json({
        message: "Successful",
        page,
        count: appointments.length,
        totalItems,
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

      const appointment = await Appointments.findById(req.params.id).populate(
        "user"
      );

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
        $or: [{ user: req.user.id }, { patientID: req.user.patientID }],
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

      const { forSomeOne, firstName, lastName, gender, phone, dOB, date, time, ...rest } =
        req.body;

      const appointmentData = {
        date,
        time,
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
              dOB,
            }
          : undefined,
      };

      const savedAppointment = new Appointments(appointmentData);
      await savedAppointment.save();

      await Users.findByIdAndUpdate(id, {
        $push: { "patientInfo.appointments": savedAppointment._id },
      });

      const patientBookedFor = forSomeOne ? `${firstName} ${lastName}` : `${req.user?.firstName} ${req.user?.lastName}`

      const zoomMeetingLink = await getZoomMeetingLink(
        "ExpatDocOnline Meeting",
        formatDate(date),
        `${patientBookedFor}'s consulation with ExpatDocOnline`,
      )

      savedAppointment.meetingLink = zoomMeetingLink
      await savedAppointment.save();


      if (validEmail(req.user.email)) {
        await sendOneOnOneConsultationEMailToUser(
          req.user.email,
          patientBookedFor,
          "ExpatDoc Online",
          date,
          time,
          15,
          zoomMeetingLink
        );
      }

      if (validEmail(`${process.env.ADMIN_EMAIL}`)) {
        await sendOneOnOneConsultationEMailToDoctor(
          req.user.email,
          patientBookedFor,
          "ExpatDoc Online",
          date,
          time,
          15,
          zoomMeetingLink
        );
      }

      await createNotification({
        title: "Appointment Reminder",
        message: "Appointment with ExpatDoc Online booked successfully.",
        type: "appointment",
        recipientId: req.user?.id,
        recipientRole: "patient",
        data: {},
      });

      return res.status(200).json({
        message: "Successful",
        appointment: savedAppointment,
      });



    } catch (err: any) {
      return res
        .status(500)
        .json({ message: "Error booking appointment", error: err.message });
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

      console.log(req.admin, req.moderator, req.doctor);

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
      res.status(500).json({
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

        await createNotification({
          title: `Appointment ${status}`,
          message: `Your appointment with ExpatDoc was ${status}.`,
          type: "appointment",
          recipientId: `${appointment.user}`,
          recipientRole: "patient",
          data: {},
        });

        res.status(201).json({
          message: "Successful",
          appointment,
        });
      }
    } catch (err: any) {
      res.status(500).json({ message: "Server error.", error: err.message });
    }
  },


  authZoom: async (req: Request, res: Response) => {
    try {
      const clientId = `${process.env.ZOOM_CLIENT_ID}`;
      // const redirect_uri = encodeURIComponent(process.env.REDIRECT_URI);
      const redirect_uri = encodeURIComponent(
        `http://localhost:8082/api/callback`
      );
      const responseType = "code";
      const authorizationUrl = `https://zoom.us/oauth/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirect_uri}`;

      res.redirect(authorizationUrl);

    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },

  zoomCallBack: async (req: Request, res: Response) => {
    try {
      const code = req.query.code;

      if (!code) {
        return res.status(400).send("No code provided");
      }

      // console.log({ code }); 

      const response = await axios.post("https://zoom.us/oauth/token", null, {
        params: {
          grant_type: "authorization_code",
          code,
          redirect_uri: `${process.env.REDIRECT_URI}`, 
        },
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      res.json({ response: response.data, code });

    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },

  zoomRefreshToken: async (req: Request, res: Response) => {
    try {
      // const refresh_token = req.query.refreshToken;

      // Zoom's refresh tokens expire after 15 years by default. However, each time you use a refresh token to obtain a new access token, Zoom issues a new refresh token. This new refresh token must be saved, as the old one becomes invalid once a new one is issued.

      const zoomVariables = await ZoomVariables.findOne();

      // console.log({zoomVariables})

      if (zoomVariables && zoomVariables.zoomRefreshToken) {
        const refresh_token = zoomVariables.zoomRefreshToken;

        const response = await axios.post("https://zoom.us/oauth/token", null, {
          params: {
            grant_type: "refresh_token",
            refresh_token,
          },
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
            ).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
  
        return res.json(response.data);
      }
      return res.json({message: "TOKEN NOT FOUND."});


    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },

  saveZoomRefreshToken: async (req: Request, res: Response) => {
    try {
      const { zoomRefreshToken } = req.body;

        let existingToken = await ZoomVariables.findOne();

        if (existingToken) {

          existingToken.zoomRefreshToken = zoomRefreshToken;
            await existingToken.save();
        } else {

          existingToken = new ZoomVariables({ zoomRefreshToken });
            await existingToken.save();
        }

        return res.status(200).json({
            message: "Successful",
            result: existingToken,
        });

    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },

  getMeetingLink: async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {

      const zoomMeetingLink = await getZoomMeetingLink(
        "ExpatDocOnline Meeting",
        "2024-06-06T23:00:00.000Z",
        ` David's consulation with ExpatDocOnline`,
      )

      res.status(201).json({
        message: "Successful",
        zoomMeetingLink,
      });
    } catch (err: any) {
      res.status(500).json({ message: "Server error.", error: err.message });
    }
  },

  
};

export default appointmentCtrl;
