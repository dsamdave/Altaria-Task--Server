

import mongoose, { Schema, Document } from 'mongoose';
import { stringDefault } from '../../types/schemaTypes';


interface IAppointment extends Document {
    doctor: mongoose.Types.ObjectId;
    patientName: string;
    patientEmail: string;
    patientPhoneNumber: string;
    appointmentDate: Date;
    reason: string;
}



const AppointmentSchema: Schema = new Schema({
    doctor: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
    patientName: stringDefault,
    patientEmail: stringDefault,
    patientPhoneNumber: stringDefault,
    appointmentDate: { type: Date, required: true },
    reason: stringDefault
},{
    toJSON: {
        transform(document, returnedObject) {
            returnedObject.id = returnedObject._id.toString()
            delete returnedObject.__v;
            delete returnedObject._id;

        }
    },
    timestamps:true
});




const Appointment = mongoose.model<IAppointment>('appointment', AppointmentSchema);

export default Appointment;
