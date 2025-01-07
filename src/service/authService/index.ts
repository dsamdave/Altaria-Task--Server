import Users from "../../models/userModel";
import {
  ForgotUserPasswordParams,
  LoginUserParams,
  RegisterUserParams,
  ResetUserPasswordParams,
  RetrieveUserInfoParams,
  VerifyUserOTPParams,
} from "../../types/servicesTypes";

const authService = {

  registerUser: async ({
    email,
    phoneNumber,
    password,
    otp,
    otpExpiry,
  }: RegisterUserParams) => {
    const existingUser = await Users.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      throw new Error("User account already exists");
    }

    const user = new Users({ email, phoneNumber, password, otp, otpExpiry });
    await user.save();

    return user;
  },

  loginUser: async ({ identifier, password }: LoginUserParams) => {
    const user = await Users.findOne({
      $or: [{ email: identifier }, { phoneNumber: identifier }],
    });

    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid credentials");
    }

    if (!user.verified) {
      throw new Error("User account not verified");
    }

    return { user };
  },

  forgotUserPassword: async ({
    identifier,
    otp,
    otpExpiry,
  }: ForgotUserPasswordParams) => {
    const user = await Users.findOne({
      $or: [{ email: identifier }, { phoneNumber: identifier }],
    });

    if (!user) {
      throw new Error("User account not found");
    }

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
  },

  resetUserPassword: async ({ id, password }: ResetUserPasswordParams) => {
    const user = await Users.findById(id);

    if (!user) {
      throw new Error("Invalid or expired OTP");
    }

    user.password = password;

    await user.save();
  },

  verifyUserOTP: async ({ otp }: VerifyUserOTPParams) => {
    const user = await Users.findOne({ otp, otpExpiry: { $gt: new Date() } });

    if (!user) {
      throw new Error("Invalid or expired OTP");
    }

    user.verified = true
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    return { user };
  },

  generateOTPForUser: async ({
    identifier,
    otp,
    otpExpiry,
  }: ForgotUserPasswordParams) => {

    const user = await Users.findOne({
      $or: [{ email: identifier }, { phoneNumber: identifier }],
    });

    if (!user) {
      throw new Error("User account not found");
    }

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
  },

  retrieveUserInfo: async ({ id }: RetrieveUserInfoParams) => {
    const user = await Users.findById(id);

    if (!user) {
      throw new Error("User account not found.");
    }

    return { user };
  },
};

export default authService;
