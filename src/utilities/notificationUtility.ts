import nodemailer from "nodemailer";
import twilio from "twilio";
import { capitalizeEachWord, formatDateWithOrdinal } from "./utils";

const {
  TWILIO_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  ADMIN_EMAIL,
  ADMIN_EMAIL_PASSWORD,
} = process.env;

const auth = {
  user: `${ADMIN_EMAIL}`,
  pass: `${ADMIN_EMAIL_PASSWORD}`,
};

export function generateOTP(length: number = 4, expiresInMinutes: number = 10) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  const otpExpires = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  return { otp, otpExpires };
}

export const sendOTPEMail = async (userEmail: string, otp: string) => {
  try {
    const { MED_TELE_EMAIL, MED_TELE_EMAIL_PASSWORD } = process.env;

    let mailTransporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: `${MED_TELE_EMAIL}`,
        pass: `${MED_TELE_EMAIL_PASSWORD}`,
      },
    });

    let mailDetails = {
      from: `"Med-Tele Healthcare" <${MED_TELE_EMAIL}>`,
      to: `${userEmail}`,
      subject: `Password Reset OTP`,
      html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: #F8CA25">Your OTP.</h2>

            <p >Your OTP for password reset is: ${otp}. It is valid for 10 minutes.</p>
            
          
            

            <h3 style="margin-top: 50px;">Med-Tele Healthcare Admin</h3>
            
                `,
    };

    const result = await mailTransporter.sendMail(mailDetails);
    return "Email sent successfully";
  } catch (error: any) {
    console.log(error);
  }
};

export const sendOTPSMS = async (
  phoneNumber: string,
  otp: string
): Promise<string> => {
  try {
    if (!TWILIO_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      throw new Error(
        "Twilio credentials are not set properly in environment variables."
      );
    }

    const twilioClient = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

    const message = await twilioClient.messages.create({
      body: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
      from: TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log("Message SID:", message.sid);
    return "SMS sent successfully";
  } catch (error) {
    console.error("Failed to send SMS:", error);
    throw new Error("Unable to send SMS. Please try again later.");
  }
};

export const sendOTPToEmail = async (
  to: string,
  otp: string
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth,
  });

  const mailOptions = {
    from: `"ExpatDoc Online" <${ADMIN_EMAIL}>`,
    to,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendOneOnOneConsultationEMailToUser = async (
  userEmail: string,
  userName: string,
  consultantName: string,
  consultationDate: string,
  consultationTime: string,
  DurationInMinutes: number,
  meetingLink: string
) => {
  try {
    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth,
    });

    let mailDetails = {
      from: `"ExpatDoc Online" <${ADMIN_EMAIL}>`,
      to: `${userEmail}`,
      subject: `Subject: Confirmation: Your One-on-One Consultation is Booked!`,
      html: `
           
        <div style="background-color: #F8F8FC; padding: 20px; margin: 0; font-family: Arial, sans-serif;">

     

    <div style="max-width: 544px; margin: 0 auto; background-color: white;">
       
  
          <div style="padding: 30px 20px;">
              <h1 style="font-size: 18px; color: #000; font-weight: bold; text-align: center;">Session Booked</h1>
  
              
              <h2>Hello ${capitalizeEachWord(userName)},</h2>

            <p >We are thrilled to inform you that your one-on-one consultation has been successfully booked with ${capitalizeEachWord(
              consultantName
            )}.</p>

            <h4>Consultation Details:</h4>

            <h5>Doctor: ${consultantName}</h5>
            <h5>Date: ${formatDateWithOrdinal(consultationDate)}</h5>
            <h5>Time: ${consultationTime}</h5>
            <h5>Duration: ${DurationInMinutes} Minutes</h5>
            <h5>Meeting Link: ${meetingLink}</h5>

            
            <p>Please make sure to mark your calendar and be ready for this valuable session.</p>
        
            <p>If you have any questions or need to reschedule, please contact our support team at support@expatdoconline.ie as soon as possible.</p>

            <p>We look forward to providing you with an insightful and productive consultation. Thank you for choosing ExpatDoc Online.</p>

  
  
            <h6 style="font-size: 14px; color: #000; font-weight: bold;">The ExpatDoc Online Team</h6>
  
            
          </div>
      </div>
  </div>
                `,
    };

    const result = await mailTransporter.sendMail(mailDetails);
    return "Email sent successfully";
  } catch (error: any) {
    console.log(error);
  }
};


export const sendOneOnOneConsultationEMailToDoctor = async (
  userEmail: string,
  userName: string,
  consultantName: string,
  consultationDate: string,
  consultationTime: string,
  DurationInMinutes: number,
  meetingLink: string
) => {
  try {
    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth,
    });

    let mailDetails = {
      from: `"ExpatDoc Online" <${ADMIN_EMAIL}>`,
      to: `${ADMIN_EMAIL}`,
      subject: `Subject: One-on-One Consultation Booked with ${userName}`,
      html: `
           
        <div style="background-color: #F8F8FC; padding: 20px; margin: 0; font-family: Arial, sans-serif;">

     

    <div style="max-width: 544px; margin: 0 auto; background-color: white;">
       
  
          <div style="padding: 30px 20px;">
              <h1 style="font-size: 18px; color: #000; font-weight: bold; text-align: center;">Session Booked</h1>
  
              
              <h2>Hello ${capitalizeEachWord(consultantName)},</h2>

            <p >A one-on-one consultation has been successfully booked with you by ${capitalizeEachWord(
                userName
              )}.</p>

            <h4>Consultation Details:</h4>

            <h5>Patient: ${userName}</h5>
            <h5>Date: ${formatDateWithOrdinal(consultationDate)}</h5>
            <h5>Time: ${consultationTime}</h5>
            <h5>Duration: ${DurationInMinutes} Minutes</h5>
            <h5>Meeting Link: ${meetingLink}</h5>

            
              <p>Please make sure to mark your calendar and be ready for this consultation.</p>
          
              <p>If you have any questions or need to make adjustments, please contact the user at ${userEmail}.</p>
  
              <p>Thank you for your dedication and service!</p>

  
  
            <h6 style="font-size: 14px; color: #000; font-weight: bold;">The ExpatDoc Online Team</h6>
  
            
          </div>
      </div>
  </div>
                `,
    };

    const result = await mailTransporter.sendMail(mailDetails);
    return "Email sent successfully";
  } catch (error: any) {
    console.log(error);
  }
};
