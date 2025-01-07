import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  id: string;
  email?: string;
  phoneNumber?: string;
  password: string;
  role: string;
  otp?: string;
  otpExpiry?: Date;
  verified: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema({

  email: { type: String, unique: true, sparse: true },
  phoneNumber: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  otp: String,
  otpExpiry: Date,
  role: { type: String, default: "user" },
  verified: { type: Boolean, default: false },

}, { 
  timestamps: true,
  toJSON: {
    transform(document, returnedObject) {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
      delete returnedObject.password;
      delete returnedObject.verified;

    }
},
});







userSchema.pre<IUser>('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.comparePassword = function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};




export default mongoose.model<IUser>('User', userSchema);







