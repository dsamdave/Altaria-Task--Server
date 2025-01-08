import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Users from "../../models/userModel";
import { IReqAuth } from "../../types/express";

const auth = async (req: IReqAuth, res: Response, next: NextFunction) => {
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ status: false, message: "Unauthorized Access", data: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };

    const user = await Users.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({
          status: false,
          message: "User account does not exist.",
          data: null,
        });
    }

    req.user = user;
    req.role = user.role;

    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("An unknown error occurred.");
    }
    return res
      .status(401)
      .json({ status: false, message: "Unauthorized Access", data: null });
  }
};

export default auth;
