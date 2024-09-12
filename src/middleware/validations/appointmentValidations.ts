
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
    date,
    time,
    reason, 
    category
 } = req.body;

  const errors = []; 

  if (!category) {
    errors.push("Please enter appointment category.");
  } 

  if(category.toLowerCase() === "someone" && !patientName) {
    errors.push("Please enter patient name.");
  } 

  if (!date) {
    errors.push("Please enter appointment date.");
  } 
  if (!time) {
    errors.push("Please enter appointment time.");
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