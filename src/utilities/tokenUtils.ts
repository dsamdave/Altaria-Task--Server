import jwt from "jsonwebtoken";

import { Response } from "express";
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


    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",  
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,  
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
