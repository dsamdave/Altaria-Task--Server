import { Schema, model, Document } from "mongoose";

// Define the interface
interface IAppointment extends Document {
  user: Schema.Types.ObjectId;
  patientID: string;

  category: string;
  patientName: string;
  reason: string;

  date: Date;
  time: string;

  patientType: string;

  status: "Pending" | "Accepted" | "Declined" | "Concluded";
}

// Define the schema
const appointmentSchema = new Schema<IAppointment>(
  {
    category: { type: String, required: true },
    patientName: { type: String },
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
  },{
    toJSON: {
        transform(document, returnedObject) {
          returnedObject.id = returnedObject._id.toString();
            delete returnedObject.__v;
            delete returnedObject._id;

        }
    },
    timestamps:true
});

const Appointment = model<IAppointment>("appointment", appointmentSchema);

export default Appointment;
