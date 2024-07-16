
import { Request, Response, NextFunction } from "express";

export const validateBookingAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { 
    doctor,
    patientName,
    patientEmail,
    patientPhoneNumber,
    appointmentDate,
    reason, 
 } = req.body;

  const errors = [];

  if (!doctor) {
    errors.push("Please enter doctor ID.");
  } 

  if (!patientName) {
    errors.push("Please enter patient name.");
  } 

  if (!appointmentDate) {
    errors.push("Please enter a password.");
  } 

  if (errors.length > 0) return res.status(400).json({ message: errors });

  next();
};


export const validateFreeQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { 
    
    medications,
    allergies,
    previouslyDiagnosed,
    question,


        conditionName,
        conditionTime,
        optionalNote,


        firstName,
        lastName,
        relationship,
        dateOfBirth,

 } = req.body;

  const errors = [];

  if (!question) {
    errors.push("Please enter your question.");
  } 



  if (errors.length > 0) return res.status(400).json({ message: errors });

  next();
};


export const validateAnswers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { 
    
    content

 } = req.body;

  const errors = [];

  if (!content) {
    errors.push("Please enter your answer.");
  } 



  if (errors.length > 0) return res.status(400).json({ message: errors });

  next();
};