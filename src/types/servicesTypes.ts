

export interface RegisterUserParams {
    email?: string;
    phoneNumber?: string;
    password: string;
    otp: string;
    otpExpiry: Date;
  }
  export interface LoginUserParams {
    identifier: string;
    password: string;
  }

  export interface ForgotUserPasswordParams {
    identifier: string;
    otp: string;
    otpExpiry: Date;
  }

  export interface ResetUserPasswordParams {
    id: string;
    password: string;
  }

  export interface VerifyUserOTPParams {
    otp: string;
  }

  export interface RetrieveUserInfoParams {
    id: string;
  }