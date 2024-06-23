import mongoose, { Document, Schema } from 'mongoose';

export interface IOTP extends Document {
  userID: mongoose.Schema.Types.ObjectId;
  otp: string;
  expiryDate: Date;
}

const otpSchema = new Schema<IOTP>({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  otp: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
});

export default mongoose.model<IOTP>('OTP', otpSchema);
