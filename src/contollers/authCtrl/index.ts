import { Request, response, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import Users, { IUser } from "../../models/userModel";

import { IReqAuth } from "../../types/express";
import { generateTokens } from "../../utilities/tokenUtils";
import {
  generateOTP,
  sendOTPToEmail,
} from "../../utilities/notificationUtility";
import { hashPassword } from "../../utilities/passwordUtility";
import crypto from "crypto";

const authCtrl = {
  register: async (req: Request, res: Response) => {
    const {
      phoneNumber,
      password,
      country,
      state,
      firstName,
      lastName,
      longitude,
      latitude,
      email,
    } = req.body;
    try {
      const existingUser = await Users.findOne({
        $or: [{ email }, { phoneNumber }],
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User account already exists." });
      }

      // const patientID = await generateUniquePatientID();

      const hashedPassword = await hashPassword(password, 12);

      const { otp, otpExpires } = generateOTP();
      await sendOTPToEmail(email, otp);

      const user: IUser = new Users({
        email,
        // patientID,
        phoneNumber,
        password: hashedPassword,
        country,
        state,
        firstName,
        lastName,
        longitude,
        latitude,
        otp,
        otpExpires,
      });
      await user.save();

      res.status(201).json({
        message: "Successful",
        user,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  },

  verifyOtp: async (req: IReqAuth, res: Response) => {
    const { identifier, otp } = req.body;

    try {
      const user = await Users.findOne({ email: identifier });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      if (user.otpExpires && user.otpExpires < new Date()) {
        return res.status(400).json({ message: "OTP has expired." });
      }

      // Use a constant-time comparison for security
      const isOtpValid = crypto.timingSafeEqual(
        Buffer.from(user.otp || ""),
        Buffer.from(otp || "")
      );

      if (!isOtpValid) {
        return res.status(400).json({ message: "Invalid OTP." });
      }

      // Clear OTP and expiration after successful verification
      user.verified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();



      return res.status(200).json({ message: "Successful" });

    } catch (err: any) {
      return res.status(500).json({ message: err.message });
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

      if (!user.verified) {
        return res
          .status(400)
          .json({ message: "This user account is not verified." });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch)
        return res
          .status(400)
          .json({ message: "invalid email, phone number or password!" });

      const { accessToken, refreshToken } = await generateTokens(user, res);

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

  // refreshToken: async (req: IReqAuth, res: Response, next: NextFunction) => {
  //   const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  //   if (!refreshToken) {
  //     return res.status(403).json({ message: "Refresh Token is required!" });
  //   }

  //   try {
  //     const decoded = jwt.verify(
  //       refreshToken,
  //       process.env.JWT_REFRESH_SECRET!
  //     ) as { id: string };
  //     const existingToken = await RefreshToken.findOne({ token: refreshToken });

  //     if (!existingToken || existingToken.expiryDate < new Date()) {
  //       return res.status(403).json({ message: "Refresh Token is not valid!" });
  //     }

  //     const user = await Users.findById(decoded.id);
  //     if (!user) {
  //       return res.status(403).json({ message: "User not found!" });
  //     }

  //     const { accessToken, refreshToken: newRefreshToken } =
  //       await generateTokens(user, res);

  //     existingToken.token = newRefreshToken;
  //     existingToken.expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  //     await existingToken.save();

  //     if (req.body.isMobile) {
  //       res.status(200).json({
  //         message: "Successful",
  //         accessToken,
  //         refreshToken: newRefreshToken,
  //       });
  //     } else {
  //       res.status(200).json({
  //         message: "Successful",
  //         accessToken,
  //         refreshToken: newRefreshToken,
  //       });
  //     }
  //   } catch (err: any) {
  //     res.status(500).json({ message: "Server error.", error: err.message });
  //   }
  // },

  requestOTP: async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
      const { identifier } = req.body;
      const user: IUser | null = await Users.findOne({
        $or: [{ email: identifier }, { phoneNumber: identifier }],
      });

      if (!user) {
        return res.status(400).json({ message: "User not found." });
      }

      const { otp, otpExpires } = generateOTP();

      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      await sendOTPToEmail(identifier, otp);

      res.status(200).json({ message: "Successful" });
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

      const { otp, otpExpires } = generateOTP();

      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      await sendOTPToEmail(identifier, otp);

      res.status(200).json({ message: "Successful" });
    } catch (err) {
      next(err);
    }
  },

  // verifyOTP: async (
  //   req: IReqAuth,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const { identifier, otp } = req.body;

  //     const user: IUser | null = await Users.findOne({
  //       $or: [{ email: identifier }, { phoneNumber: identifier }],
  //     });

  //     if (!user) {
  //       return res
  //         .status(400)
  //         .json({ message: "User account does not exist." });
  //     }

  //     const otpRecord = await OTP.findOne({
  //       userID: user._id,
  //       otp,
  //       expiryDate: { $gt: Date.now() },
  //     });

  //     if (!otpRecord) {
  //       return res
  //         .status(400)
  //         .json({ message: "OTP is invalid or has expired." });
  //     }

  //     await OTP.deleteOne({ _id: otpRecord._id });

  //     res.status(201).json({
  //       message: "Successful",
  //       user,
  //     });
  //   } catch (err: any) {
  //     res.status(500).json({ message: "Server error.", error: err.message });
  //   }
  // },

  resetPassword: async (req: IReqAuth, res: Response, next: NextFunction) => {
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

      user.password = await hashPassword(password, 12);

      await user.save();

      res.status(201).json({
        message: "Successful",
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
      const { identifier, password, otp } = req.body;

      const user: IUser | null = await Users.findOne({
        $or: [{ email: identifier }, { phoneNumber: identifier }],
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "User account does not exist." });
      }

      if (user.otpExpires && user.otpExpires < new Date()) {
        return res.status(400).json({ message: "OTP has expired." });
      }

      const isOtpValid = crypto.timingSafeEqual(
        Buffer.from(user.otp || ""),
        Buffer.from(otp || "")
      );

      if (!isOtpValid) {
        return res.status(400).json({ message: "Invalid OTP." });
      }

      user.password = await hashPassword(password, 12);

      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

   

      res.status(201).json({
        message: "Successful",
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
        firstName,
        lastName,
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
          firstName,
          lastName,
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
            avatar,
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

  updateAvatar: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.user)
        return res.status(401).json({ message: "Invalid Authentication." });

      const loggedInUser = req.user;

      const { avatar } = req.body;

      const user = await Users.findOneAndUpdate(
        {
          $or: [
            { email: loggedInUser.email },
            { phoneNumber: loggedInUser.phoneNumber },
          ],
        },
        {
          avatar,
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Successful",
        user,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },

  updateUserLocation: async (req: IReqAuth, res: Response) => {
    try {
      if (!req.user)
        return res.status(401).json({ message: "Invalid Authentication." });

      const loggedInUser = req.user;

      const { latitude, longitude } = req.body;

      const updatedApplication = await Users.findOneAndUpdate(
        {
          $or: [
            { email: loggedInUser.email },
            { phoneNumber: loggedInUser.phoneNumber },
          ],
        },
        {
          latitude,
          longitude,
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

  test: async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      res.status(201).json({
        message: "Email sent successfully.",
        email
      });
    } catch (err: any) {
      res.status(500).json({ message: "Server error.", error: err.message });
    }
  },
};

export default authCtrl;
