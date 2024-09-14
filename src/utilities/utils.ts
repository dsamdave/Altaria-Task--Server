import { Request, response, Response } from "express";
import Users from "../models/userModel"

export const pagination = (req: Request) => {
  const page = Number(req.query.page) * 1 || 1;
  const limit = Number(req.query.limit) * 1 || 10;
  const skip = limit * (page - 1);

  return { page, limit, skip };
};


export const checkPatientType = async (patientID: string) => {

  if (!patientID) {
    return null;
  }

  try {

    const patient = await Users.findById(patientID) 


    if (patient && patient?.patientInfo?.appointments?.length > 0) {
      return 'Old Patient';  
    } else {
      return 'New Patient'; 
    }
  } catch (error) {
    console.error('Error checking patient type:', error);
    throw error; 
  }
};


const generateRandomNumber = (length: number): string => {
  return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1))).toString();
};

export const generateUniquePatientID = async (): Promise<string> => {
  let isUnique = false;
  let patientID = '';

  while (!isUnique) {
    const firstGroup = generateRandomNumber(3);  
    const secondGroup = generateRandomNumber(3);  
    const thirdGroup = generateRandomNumber(4);  
    patientID = `${firstGroup}-${secondGroup}-${thirdGroup}`;

    const existingPatient = await Users.findOne({ patientID });

    if (!existingPatient) {
      isUnique = true;
    }
  }

  return patientID;
};
