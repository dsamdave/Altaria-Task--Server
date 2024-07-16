import mongoose, { Document, Schema, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';
import { numberDefault, stringDefault } from '../../types/schemaTypes';

export interface IUser extends Document {
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
  fullName: string
  country: string
  state: string

  basicInformation: {
    avatar: string
    // fullName: string
    birthDate: string
    gender: string
    languages: string[]
    contactInfo: {
      email: string
      emergencyPhoneNumber: string
      address: string
    }
    emergencyContact: {
      name: string
      contactEmergencyPhoneNumber: string
      relationship: string
    }
  }

  doctorInfo: {
    fullName: string;
    specialty: string;
    address: string;

    clinicName: string;
    clinicLocation: string;
    consultationFee: number;

    workingHours: string;
    appointments: mongoose.Types.ObjectId[];
  }
}



const basicInfoSchema: Schema = new Schema({


  birthDate: stringDefault,
  gender: stringDefault,
  languages: {type: [String], default: []},
  contactInfo: {
    email: stringDefault,
    emergencyPhoneNumber: stringDefault,
    address: stringDefault,
  },
  emergencyContact: {
    name: stringDefault,
    contactEmergencyPhoneNumber: stringDefault,
    relationship: stringDefault,
  },
  avatar: {
    type: String,
    default: 'https://res.cloudinary.com/virtualsavvyng/image/upload/v1681556292/realties/user1_xhiugc.png'
},
},{
    toJSON: {
        transform(document, returnedObject) {
            delete returnedObject.__v;
            delete returnedObject._id;
            delete returnedObject.createdAt;
            delete returnedObject.updatedAt;

        }
    },
    timestamps:true
});



const doctorInfoSchema: Schema = new Schema({

  fullName: stringDefault,
  specialty:stringDefault,
  address:stringDefault,

  clinicName:stringDefault,
  clinicLocation:stringDefault,
  consultationFee: numberDefault,

  workingHours:stringDefault,
  appointments: [{ type: mongoose.Types.ObjectId, ref: 'Appointment' }]

},{
    toJSON: {
        transform(document, returnedObject) {
            delete returnedObject.__v;
            delete returnedObject._id;
            delete returnedObject.createdAt;
            delete returnedObject.updatedAt;

        }
    },
    timestamps:true
});






const UserSchema: Schema = new Schema({
  email: {
    type: String,
    default: null
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user", 
  },
  fullName: stringDefault,
  country: stringDefault,
  state: stringDefault,


  basicInformation : basicInfoSchema,

  doctorInfo: doctorInfoSchema


},{
    toJSON: {
        transform(document, returnedObject) {
            returnedObject.id = returnedObject._id.toString(),
            delete returnedObject._id;
            delete returnedObject.__v;
            delete returnedObject.createdAt;
            delete returnedObject.updatedAt;
            delete returnedObject.password;

        }
    },
    timestamps:true
});





export default mongoose.model<IUser>('user', UserSchema);
