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


export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); 
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}


export const capitalizeEachWord = (str?: string) => {
  if (!str) return '';
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const formatDateWithOrdinal = (dateInput: string | Date): string => {
  function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th'; // covers 4th to 20th
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  const date: Date = (typeof dateInput === 'string' || typeof dateInput === 'number') ? new Date(dateInput) : dateInput;
  const day: number = date.getUTCDate();
  const month: string = date.toLocaleString('en-US', { month: 'long' });
  const year: number = date.getUTCFullYear();
  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}