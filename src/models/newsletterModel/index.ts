
import mongoose, { Document, Schema } from 'mongoose';

export interface IRefreshToken extends Document {
    email: string;
}

const subscriberSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

  });
  
  const Newsletter = mongoose.model('Newsletter', subscriberSchema);
  

export default Newsletter;
