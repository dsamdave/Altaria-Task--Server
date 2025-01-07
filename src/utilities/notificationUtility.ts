import nodemailer from "nodemailer";
import twilio from "twilio";

const {
  TWILIO_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  // ADMIN_EMAIL,
  // ADMIN_EMAIL_PASSWORD,
  BLACKNIGHT_EMAIL,
  BLACKNIGHT_EMAIL_PASSWORD,
} = process.env;

// const auth = {
//   user: `${ADMIN_EMAIL}`,
//   pass: `${ADMIN_EMAIL_PASSWORD}`,
// };

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
    const mailTransporter = nodemailer.createTransport({
      host: "smtp0101.titan.email",
      port: 587,
      auth: {
        user: BLACKNIGHT_EMAIL,
        pass: BLACKNIGHT_EMAIL_PASSWORD,
      },
    });

    const mailDetails = {
      from: `"ExpatDoctor Online" <${BLACKNIGHT_EMAIL}>`,
      to: `${userEmail}`,
      subject: `Password Reset OTP`,
      html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: #4A90E2">Your OTP.</h2>

            <p >Your OTP for password reset is: ${otp}. It is valid for 10 minutes.</p>
            
          
            

            <h3 style="margin-top: 50px;">Med-Tele Healthcare Admin</h3>
            
                `,
    };

    await mailTransporter.sendMail(mailDetails);
    return "Email sent successfully";
  } catch (error: unknown) {
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
  try {
    const mailTransporter = nodemailer.createTransport({
      host: "smtp0101.titan.email",
      port: 587,
      auth: {
        user: BLACKNIGHT_EMAIL,
        pass: BLACKNIGHT_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"ExpatDoctor Online" <${BLACKNIGHT_EMAIL}>`,
      to,
      subject: "Your OTP",
      html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: #4A90E2">Your OTP</h2>

            <p >Your OTP is: ${otp}. It is valid for 10 minutes.</p>
            
          
            

            <h3 style="margin-top: 50px;">Med-Tele Healthcare Admin</h3>
            
                `,
    };

    await mailTransporter.sendMail(mailOptions);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("An unknown error occurred.");
    }
  }
};
