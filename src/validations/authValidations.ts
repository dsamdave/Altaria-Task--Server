import { Request, Response, NextFunction } from "express";

export const validateRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, phoneNumber, password } = req.body;

  const errors = [];

  if (!email) {
    errors.push("Please enter your email.");
  } else if (!validEmail(email)) {
    errors.push("Email format is incorrect.");
  }

  if (!phoneNumber) {
    errors.push("Please enter your phone number.");
  } 

  if (!password) {
    errors.push("Please enter a password.");
  } else if (password.length < 6) {
    errors.push("Please password must be 6 chars.");
  } else if (!/[A-Z]/.test(password)) {
    errors.push("Please password must contain a capital letter");
  } else if (!/[0-9]/.test(password)) {
    errors.push("Please password must contain a number");
  }

  if(errors.length > 0) return res.status(400).json({status: false, message: errors, data: null})

  next();
};


export const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { identifier, password } = req.body
  
    const errors = [];
  
    if(!identifier){
      errors.push("Please enter your email or phone number.")
    }
  
    if(!password){
      errors.push("Please enter your password.")
    }
  
    if(errors.length > 0) return res.status(400).json({status: false, message: errors, data: null})
  
    next();
  }


export const validateAddEvents = async (req: Request, res: Response, next: NextFunction) => {
    const { name, type, address, latitude, longitude } = req.body
  
    const errors = [];
  
    if(!name){
      errors.push("Please event name.")
    }
    if(!type){
      errors.push("Please event type.")
    }
    if(!address){
      errors.push("Please event type.")
    }
    if(!latitude || !longitude){
      errors.push("Please event coordinates.")
    }
  

  
    if(errors.length > 0) return res.status(400).json({status: false, message: errors, data: null})
  
    next();
  }








export function validEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
