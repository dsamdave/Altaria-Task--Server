import { Schema, model, Document } from "mongoose";
import { reqString } from "../../types/schemaTypes";

// Define the interface
interface IAppointment extends Document {
  user: Schema.Types.ObjectId;
  patientID: string;

  category: string;
  reason: string;
  
  date: Date;
  time: string;
  
  patientType: string;
  
  status: "Pending" | "Accepted" | "Declined" | "Concluded";
  
  appointMentNature: string
  appointMentType: string
  
  
  forSomeOne: boolean
  someOneDetails: {
    patientName: string;
    firstName: string
    gender: string
    lastName: string
    phone: string
    dOB: string
  }
}

// Define the schema
const appointmentSchema = new Schema<IAppointment>(
  {
    category: { type: String, required: true },
    reason: { type: String, required: true },
    
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    patientID: { type: String },
    
    date: { type: Date, required: true },
    time: { type: String, required: true },
    
    patientType: { type: String, required: true },
    
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Declined", "Concluded"],
      default: "Pending",
    },
    
    appointMentNature: reqString,
    appointMentType: reqString,
    
    
    forSomeOne: { type: Boolean },
    someOneDetails: {
      patientName: reqString,
      firstName: reqString,
      gender: reqString,
      lastName: reqString,
      phone: reqString,
      dOB: reqString
    }
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
