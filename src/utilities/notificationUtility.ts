import nodemailer from "nodemailer";
import twilio from 'twilio';

const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;


export function generateOTP(length: number = 4, expiresInMinutes: number = 10) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  const otpExpires = new Date(Date.now() + expiresInMinutes * 60 * 1000);  

  return { otp, otpExpires };
}



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
  otp: string
): Promise<string> => {
  try {
    if (!TWILIO_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      throw new Error('Twilio credentials are not set properly in environment variables.');
    }

    const twilioClient = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

    const message = await twilioClient.messages.create({
      body: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
      from: TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log('Message SID:', message.sid);
    return 'SMS sent successfully';

  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw new Error('Unable to send SMS. Please try again later.');
  }
};

export const sendOTPToEmail = async (to: string, otp: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: `${process.env.ADMIN_EMAIL}`, 
      pass: `${process.env.ADMIN_EMAIL_PASSWORD}`,
    },
  });

  const mailOptions = {
    from: `${process.env.ADMIN_EMAIL}`, 
    to,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
}


