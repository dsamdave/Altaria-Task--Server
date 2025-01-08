import { Request, Response } from "express";
import {
  handleServerError,
  sendResponse,
} from "../../utilities/helpers/responseHelpers";
import authService from "../../service/authService";
import { IReqAuth } from "../../types/express";
import { generateTokens } from "../../utilities/tokenUtils";

const authCtrl = {
  register: async (req: Request, res: Response) => {
    const { name, email, phoneNumber, password } = req.body;

    try {
      await authService.registerUser({ name, email, phoneNumber, password });

      sendResponse(res, {
        statusCode: 201,
        status: true,
        message: "Registration Succesful",
        data: null,
      });
    } catch (error: unknown) {
      handleServerError(res, error);
    }
  },

  login: async (req: Request, res: Response) => {
    const { identifier, password } = req.body;
    try {
      const { user } = await authService.loginUser({ identifier, password });

      const  { accessToken } = await generateTokens(user, res)

      sendResponse(res, {
        statusCode: 200,
        status: true,
        message: "Login Successful",
        data: { accessToken, user },
      });
    } catch (error: unknown) {
      handleServerError(res, error);
    }
  },

  getUserInfo: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res
        .status(401)
        .json({
          status: false,
          message:
            "Unauthorized access. Please log in or provide valid credentials.",
          data: null,
        });

    try {
      const { user } = await authService.retrieveUserInfo({ id: req.user.id });

      sendResponse(res, {
        statusCode: 200,
        status: true,
        message: "User info retrieved successfully.",
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

export default authCtrl;
