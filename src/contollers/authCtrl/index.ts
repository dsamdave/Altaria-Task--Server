import { Request, response, Response, NextFunction } from "express";
import passport from "passport";
import nodemailer from "nodemailer";
import twilio from "twilio";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import OTP from "../../models/otp";
import Users, { IUser } from "../../models/userModel";
import RefreshToken from "../../models/refreshToken";

import ComingSoon from "../../models/comingSoonModel";
import { jayDoubleUUTeeCCkrit } from "../../config/vars";
import { IReqAuth } from "../../types/express";
import { generateOTP, generateTokens } from "../../utilities/tokenUtils";
import { sendOTPEMail, sendOTPSMS } from "../../utilities/notificationUtility";
import { hashPassword } from "../../utilities/passwordUtility";
import { generateUniquePatientID } from "../../utilities/utils";

const authCtrl = {
  register: async (req: Request, res: Response) => {

    const {  phoneNumber, password, country, state, firstName, lastName } = req.body;
    try {
      const existingUser = await Users.findOne({
        $or: [
          // { email }, 
          { phoneNumber }],
      });  
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User account already exists." });
      }

      const patientID = await generateUniquePatientID();

      const hashedPassword = await hashPassword(password, 12)

      const user: IUser = new Users({patientID, phoneNumber, password: hashedPassword, country, state, firstName, lastName });
      await user.save();

      res.status(201).json({
        message: "Successful",
        user,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  },



  login: async (req: IReqAuth, res: Response) => {
    try {
      const { identifier, password } = req.body;

      const user = await Users.findOne({
        $or: [{ email: identifier }, { phoneNumber: identifier }],
      });

      if (!user)
        return res
          .status(404)
          .json({ message: "This user account does not exist." });

    

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch)
        return res.status(400).json({ message: "invalid phone number or password!" });

      const { accessToken, refreshToken } = await generateTokens(
        user,
        res,
      );

      return res.status(200).json({
        message: "Successful",
        accessToken,
        refreshToken,
        user,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },

  refreshToken: async (req: IReqAuth, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh Token is required!" });
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as { id: string };
      const existingToken = await RefreshToken.findOne({ token: refreshToken });

      if (!existingToken || existingToken.expiryDate < new Date()) {
        return res.status(403).json({ message: "Refresh Token is not valid!" });
      }

      const user = await Users.findById(decoded.id);
      if (!user) {
        return res.status(403).json({ message: "User not found!" });
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await generateTokens(user, res );

      existingToken.token = newRefreshToken;
      existingToken.expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await existingToken.save();

      if (req.body.isMobile) {
        res
          .status(200)
          .json({
            message: "Successful",
            accessToken,
            refreshToken: newRefreshToken,
          });
      } else {
        res
          .status(200)
          .json({
            message: "Successful",
            accessToken,
            refreshToken: newRefreshToken,
          });
      }
    } catch (err: any) {
      res.status(500).json({ message: "Server error.", error: err.message });
    }
  },

  sendOTP: async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
      const { identifier } = req.body;
      const user: IUser | null = await Users.findOne({
        $or: [{ email: identifier }, { phoneNumber: identifier }],
      });

      if (!user) {
        return res.status(400).json({ message: "User not found." });
      }

      const otp = generateOTP();
      const expiryDate = Date.now() + 10 * 60 * 1000; // 10 minutes

      await new OTP({
        userID: user._id,
        otp,
        expiryDate,
      }).save();

      // if (user.email === identifier) {
      //   // Send OTP via email
      //   await sendOTPEMail(user.email, otp);
      // } else if (user.phoneNumber === identifier) {
      //   // Send OTP via SMS
      //   await sendOTPSMS(user.phoneNumber, otp);
      // }

      res.status(200).json({ message: "Successful", otp });


    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },

  forgotPassword: async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
      const { identifier } = req.body;
      const user: IUser | null = await Users.findOne({
        $or: [{ email: identifier }, { phoneNumber: identifier }],
      });

      if (!user) {
        return res.status(400).json({ message: "User not found." });
      }

      const otp = generateOTP();
      const expiryDate = Date.now() + 10 * 60 * 1000; // 10 minutes

      await new OTP({
        userID: user._id,
        otp,
        expiryDate,
      }).save();

      // if (user.email === identifier) {
      //   // Send OTP via email
      //   await sendOTPEMail(user.email, otp);
      // } else if (user.phoneNumber === identifier) {
      //   // Send OTP via SMS
      //   await sendOTPSMS(user.phoneNumber, otp);
      // }

      res.status(200).json({ message: "Successful", otp });

    } catch (err) {
      next(err);
    }
  },

  verifyOTP: async (
    req: IReqAuth,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { identifier, otp } = req.body;

      const user: IUser | null = await Users.findOne({
        $or: [{ email: identifier }, { phoneNumber: identifier }],
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "User account does not exist." });
      }

      const otpRecord = await OTP.findOne({
        userID: user._id,
        otp,
        expiryDate: { $gt: Date.now() },
      });

      if (!otpRecord) {
        return res
          .status(400)
          .json({ message: "OTP is invalid or has expired." });
      }

      await OTP.deleteOne({ _id: otpRecord._id });

      res.status(201).json({
        message: "Successful",
        user,
      });
    } catch (err: any) {
      res.status(500).json({ message: "Server error.", error: err.message });
    }
  },

  resetPasswordWithOTP: async (
    req: IReqAuth,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { identifier, password } = req.body;

      const user: IUser | null = await Users.findOne({
        $or: [{ email: identifier }, { phoneNumber: identifier }],
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "User account does not exist." });
      }

      user.password = await hashPassword(password, 12)

      await user.save();

      res.status(201).json({
        message: "Successful",
        user,
      });
    } catch (err: any) {
      res.status(500).json({ message: "Server error.", error: err.message });
    }
  },

  logout: async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.status(201).json({
        message: "User registered successfully.",
      });
    } catch (err: any) {
      res.status(500).json({ message: "Server error.", error: err.message });
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

  updateBasicInfo: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.user)
        return res.status(401).json({ message: "Invalid Authentication." });

      const loggedInUser = req.user;

      const {
        firstName, lastName,
        birthDate,
        gender,
        languages,

        email,
        emergencyPhoneNumber,
        address,
        avatar,
        name,
        contactEmergencyPhoneNumber,
        relationship,
      } = req.body;

      const updatedApplication = await Users.findOneAndUpdate(
        {
          $or: [
            { email: loggedInUser.email },
            { phoneNumber: loggedInUser.phoneNumber },
          ],
        },
        {
          firstName, lastName,
          basicInformation: {
            birthDate,
            gender,
            languages,
            contactInfo: {
              email,
              emergencyPhoneNumber,
              address,
            },
            emergencyContact: {
              name,
              contactEmergencyPhoneNumber,
              relationship,
            },
            avatar
          },
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Successful",
        application: updatedApplication,
      });

    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },
};

export default authCtrl;
