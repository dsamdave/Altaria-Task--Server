import { Schema, model, Document } from "mongoose";
import { reqString, stringDefault } from "../../types/schemaTypes";

// Define the interface
interface IAppointment extends Document {
  user: Schema.Types.ObjectId;
  patientID: string;

  category: string;
  reason: string;
  insuranceProvider: string;
  policyNumber: string;
  groupNumber: string;
  images: string[];

  date: Date;
  time: string;

  patientType: string;
  meetingLink: string;

  status: "Pending" | "Accepted" | "Declined" | "Concluded";

  appointMentNature: string;
  appointMentType: string;

  forSomeOne: boolean;
  someOneDetails: {
    patientName: string;
    firstName: string;
    gender: string;
    lastName: string;
    phone: string;
    dOB: string;
  };
}

// Define the schema
const appointmentSchema = new Schema<IAppointment>(
  {
    category: { type: String, required: true },
    reason: { type: String, required: true },
    images: { type: [String] },
    insuranceProvider: stringDefault,
    policyNumber: stringDefault,
    groupNumber: stringDefault,

    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    patientID: stringDefault,

    date: { type: Date, required: true },
    time: { type: String, required: true },

    patientType: { type: String, required: true },
    meetingLink: { type: String, default: "" },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Declined", "Concluded"],
      default: "Pending",
    },

    appointMentNature: stringDefault,
    appointMentType: stringDefault,

    forSomeOne: { type: Boolean },
    someOneDetails: {
      patientName: stringDefault,
      firstName: stringDefault,
      gender: stringDefault,
      lastName: stringDefault,
      phone: stringDefault,
      dOB: stringDefault,
    },
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

const Appointment = model<IAppointment>("appointment", appointmentSchema);

export default Appointment;
