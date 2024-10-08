import mongoose, { Schema, Document } from "mongoose";

export interface IAttachment {
  url: string;
  filename: string;
}

export interface IMessage extends Document {
  patientID: string;
  doctorID: string;
  message: string;
  attachments?: IAttachment[];
  links?: string[];
  conversationID: string;
  recipient: Schema.Types.ObjectId;
  sender: Schema.Types.ObjectId;
  doctor: Schema.Types.ObjectId;
  patient: Schema.Types.ObjectId;
}

const MessageSchema: Schema = new Schema(
  {
    patientID: { type: String, required: true },
    doctorID: { type: String, required: true },

    message: { type: String, required: true },
    attachments: [{ url: String, filename: String }],
    links: [String],

    doctor: { type: Schema.Types.ObjectId, ref: "user", required: true },
    patient: { type: Schema.Types.ObjectId, ref: "user", required: true },

    conversationID: { type: String, required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "user", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "user", required: true },
  
  },
  {
    toJSON: {
      transform(document, returnedObject) {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject.__v;
        delete returnedObject._id;
      },
    },
    timestamps: true,
  }
);

export default mongoose.model<IMessage>("Message", MessageSchema);
