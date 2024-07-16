
import { Request, Response, NextFunction } from "express";

export const validateAddMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { 
    patientID, doctorID, message, attachments, links
 } = req.body;

  const errors = [];

  if (!patientID) {
    errors.push("Please add patient ID.");
  } 

  if (!doctorID) {
    errors.push("Please add doctor ID.");
  } 

  if (!message) {
    errors.push("Please add message.");
  } 

  if (errors.length > 0) return res.status(400).json({ message: errors });

  next();
};

