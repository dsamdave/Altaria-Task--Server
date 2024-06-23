import nodemailer from "nodemailer";
import twilio from 'twilio';



export const sendOTPEMail = async (
  userEmail: string,
  otp: string,
) => {
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
  otp: string,
) => {
  try {

    const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

    await twilioClient.messages.create({
      body: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    return "SMS sent successfully";

  } catch (error: any) {
    console.log(error);
  }
};
