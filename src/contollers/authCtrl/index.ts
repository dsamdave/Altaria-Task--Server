import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import {
  handleServerError,
  sendResponse,
} from "../../utilities/helpers/responseHelpers";
import { generateOTP, sendOTP } from "../../utilities/notificationUtility";
import authService from "../../service/authService";
import { IReqAuth } from "../../types/express";

const authCtrl = {
  register: async (req: Request, res: Response) => {

    const { email, phoneNumber, password } = req.body;

    try {
  
      const { otp, otpExpiry } = await generateOTP();  

      await authService.registerUser({ email, phoneNumber, password, otp, otpExpiry });  
  
      await sendOTP(email, otp); 

      // Uncomment later when there is Twilio Details
      // await sendOTP(phoneNumber || email, otp);  
  
      sendResponse(res, {
        statusCode: 201,
        status: true,
        message: 'OTP sent for verification',
        data: { otp, otpExpiry },
      });

    } catch (error: unknown) {
      handleServerError(res, error);
    }
  },

  login: async (req: Request, res: Response) => {

    const { identifier, password } = req.body;
    try {

      const { user } = await authService.loginUser({identifier, password})

      const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN!,
      });

      sendResponse(res, {
        statusCode: 200,
        status: true,
        message: "Login Successful",
        data: { accessToken, user},
      });

    } catch (error: unknown) {
      handleServerError(res, error);
    }
  },

  forgotPassword: async (req: Request, res: Response) => {

    const { identifier, } = req.body;

    try {
      
      const { otp, otpExpiry } = await generateOTP();  

      await authService.forgotUserPassword({identifier, otp, otpExpiry})

      await sendOTP(identifier, otp);

      sendResponse(res, {
        statusCode: 200,
        status: true,
        message: 'OTP sent for verification',
        data: { otp, otpExpiry },
      });

    } catch (error: unknown) {
      handleServerError(res, error);
    }
  },

  resetPassword: async (req: IReqAuth, res: Response) => {

    if (!req.admin && !req.user && !req.moderator)
      return res.status(401).json({ status: false, message: "Unauthorized access. Please log in or provide valid credentials.", data: null });

    const { password } = req.body;

    try {

      await authService.resetUserPassword({id: req.user.id, password})

      sendResponse(res, {
        statusCode: 200,
        status: true,
        message: "Password reset successful",
        data: null,
      });

    } catch (error: unknown) {
      handleServerError(res, error);
    }
  },

  verifyOTP: async (req: Request, res: Response) => {

    const { otp } = req.body

    try {
      
      const { user } = await authService.verifyUserOTP({ otp })

      const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN!,
      });

      sendResponse(res, {
        statusCode: 200,
        status: true,
        message: "OTP Verified!",
        data: { accessToken, user },
      });

    } catch (error: unknown) {
      handleServerError(res, error);
    }
  },

  requestOTP: async (req: Request, res: Response) => {

    const { identifier } = req.body
    try {
      
      const { otp, otpExpiry } = await generateOTP();  

      await authService.generateOTPForUser({ identifier, otp, otpExpiry })

      await sendOTP(identifier, otp);

      sendResponse(res, {
        statusCode: 200,
        status: true,
        message: 'OTP sent for verification',
        data: null,
      });

    } catch (error: unknown) {
      handleServerError(res, error);
    }
  },

  getUserInfo: async (req: IReqAuth, res: Response) => {

    if (!req.admin && !req.user && !req.moderator)
        return res.status(401).json({ status: false, message: "Unauthorized access. Please log in or provide valid credentials.", data: null });

    try { 

      const { user } = await authService.retrieveUserInfo({id: req.user.id})

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
