
import mongoose, { Document, Schema } from 'mongoose';

export interface IRefreshToken extends Document {
  userID: string;
  token: string;
  expiryDate: Date;
}

const RefreshTokenSchema: Schema<IRefreshToken> = new Schema({
  userID: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
});

const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);

export default RefreshToken;
