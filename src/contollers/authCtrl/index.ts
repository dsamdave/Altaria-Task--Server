import { Request, Response } from "express";
import { handleServerError } from "../../utilities/helpers/responseHelpers";

const authCtrl = {
  example: async (req: Request, res: Response) => {
    try {
      res.status(201).json({
        message: "User registered successfully.",
      });
    } catch (error: unknown) {
        handleServerError(res, error);
    }
  },
};

export default authCtrl;
