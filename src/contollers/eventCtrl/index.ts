import { Request, Response } from "express";
import {
  handleServerError,
  sendResponse,
} from "../../utilities/helpers/responseHelpers";
import eventService from "../../service/eventService";
import { IReqAuth } from "../../types/express";
import Users from "../../models/userModel";


const eventCtrl = {
  addEvent: async (req: Request, res: Response) => {
    const { name, type, address, latitude, longitude, description, dateTime } =
      req.body;

    try {
      const event = await eventService.addEventService({
        name,
        type,
        address,
        latitude,
        longitude,
        description,
        dateTime,
      });

      sendResponse(res, {
        statusCode: 201,
        status: true,
        message: "Event created successfully",
        data: event,
      });
    } catch (error: unknown) {
      handleServerError(res, error);
    }
  },

  getEventsByLocation: async (req: Request, res: Response) => {
    const { latitude, longitude, radius = 10 } = req.body;
    try {
      const events = await eventService.eventsByLocation({
        latitude,
        longitude,
        radius,
      });

      sendResponse(res, {
        statusCode: 200,
        status: true,
        message: "Events Fetched successfully",
        data: events,
      });
    } catch (error: unknown) {
      handleServerError(res, error);
    }
  },

  bookmarkEvents: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(404).json({ message: "Invalid Authorization" });

    const { eventId } = req.params;

    try {
      const user = await eventService.bookMarkEventService({
        id: req.user.id,
        eventId,
      });

      sendResponse(res, {
        statusCode: 200,
        status: true,
        message: "Event Bookedmarked successfully",
        data: user,
      });
    } catch (error: unknown) {
      handleServerError(res, error);
    }
  },

  getBookmarked: async (req: IReqAuth, res: Response) => {

    if (!req.user)
        return res.status(404).json({ message: "Invalid Authorization" });

    try {

        const user = await Users.findById(req.user.id).populate('bookmarkedEvents');

      sendResponse(res, {
        statusCode: 200,
        status: true,
        message: "Bookmarked Events fetched successfully",
        data: user,
      });
    } catch (error: unknown) {
      handleServerError(res, error);
    }
  },

  example: async (req: Request, res: Response) => {
    try {
      sendResponse(res, {
        statusCode: 200,
        status: true,
        message: "New message successful",
        data: null,
      });
    } catch (error: unknown) {
      handleServerError(res, error);
    }
  },
};

export default eventCtrl;
