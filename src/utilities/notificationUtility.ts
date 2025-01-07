import nodemailer from "nodemailer";
// import twilio from "twilio";

// const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  
  auth: {
    user: process.env.EMAIL_USERNAME,   
    pass: process.env.EMAIL_PASSWORD,  
  },
});



export const sendOTP = async (destination: string, otp: string): Promise<void> => {
  try {
    if (destination.includes('@')) {
      // Send OTP via email
      await transporter.sendMail({
        from: `"Leira Health Support" <${process.env.EMAIL_USERNAME}>`,
        to: destination,
        subject: 'Your Verification Code',
        text: `Your verification code is ${otp}. It will expire in 10 minutes.`,
      });
      console.log(`OTP sent to email: ${destination}`);

    } else {
      // Send OTP via SMS
      throw new Error('Please enter an email to get OTP');

    }

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("An unknown error occurred.");
    }
    throw new Error('Failed to send OTP');
  }
};


// Uncomment later when there is Twilio Details
// export const sendOTP = async (destination: string, otp: string): Promise<void> => {
//   try {
//     if (destination.includes('@')) {
//       // Send OTP via email
//       await transporter.sendMail({
//         from: `"YourApp Support" <${process.env.EMAIL_USERNAME}>`,
//         to: destination,
//         subject: 'Your Verification Code',
//         text: `Your verification code is ${otp}. It will expire in 10 minutes.`,
//       });
//       console.log(`OTP sent to email: ${destination}`);

//     } else {
//       // Send OTP via SMS
//       await twilioClient.messages.create({
//         body: `Your verification code is ${otp}. It will expire in 10 minutes.`,
//         from: process.env.TWILIO_PHONE_NUMBER,
//         to: destination,
//       });
//       console.log(`OTP sent to phone: ${destination}`);
//     }

//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.log(error.message);
//     } else {
//       console.log("An unknown error occurred.");
//     }
//     throw new Error('Failed to send OTP');
//   }
// };



export function generateOTP(length: number = 4, expiresInMinutes: number = 10) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  const otpExpiry = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  return { otp, otpExpiry };
}
