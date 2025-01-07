import { Request, Response } from "express";
import {
  handleServerError,
  sendResponse,
} from "../../utilities/helpers/responseHelpers";

const authCtrl = {
  example: async (req: Request, res: Response) => {
    try {
      

      sendResponse(res, {
        statusCode: 200,
        status: true,
        message: "Seeker terms payment request successfully set",
        data: null,
      });
    } catch (error: unknown) {
      handleServerError(res, error);
    }
  },
};

export default authCtrl;
