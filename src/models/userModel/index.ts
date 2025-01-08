import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { reqString, reqUniqueString } from "../../types/schemaTypes";

export interface IUser extends Document {
  id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  password: string;
  role: string;
  verified: boolean;
  bookmarkedEvents: string[]
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema(
  {
    name: {type: String, default: ""},
    email: reqUniqueString,
    phoneNumber: reqUniqueString,
    password: reqString,
    role: { type: String, default: "user" },
    verified: { type: Boolean, default: false },
    bookmarkedEvents: { type: [String]  },
  },
  {
    timestamps: true,
    toJSON: {
      transform(document, returnedObject) {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password;
        delete returnedObject.verified;
      },
    },
  }
);

userSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
