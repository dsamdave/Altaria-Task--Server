import jwt from "jsonwebtoken";
import crypto from "crypto";

import { Response } from "express";
import RefreshToken from "../models/refreshToken";
import { IUser } from "../models/userModel";

export const generateTokens = async (
  user: IUser,
  res: Response,
) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "3d" }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );

  // Check if a refresh token already exists for the user
  const existingToken = await RefreshToken.findOne({ userId: user._id });

  if (existingToken) {
    // Update existing token
    existingToken.token = refreshToken;
    existingToken.expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await existingToken.save();
  } else {
    // Create new refresh token
    await new RefreshToken({
      userID: user._id,
      token: refreshToken,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    }).save();
  }

  // Set cookies for web applications

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });


  return { accessToken, refreshToken };
};

export const generateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000); 
  return otp.toString();
};
