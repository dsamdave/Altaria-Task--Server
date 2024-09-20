import mongoose, { Document, Schema, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';
import { numberDefault, stringDefault } from '../../types/schemaTypes';

export interface IUser extends Document {
  patientID: string;
  phoneNumber: string;
  password: string;

  role: string;
  firstName: string
  lastName: string
  middleName: string

  country: string
  state: string
  avatar: string

  latitude: number;
  longitude: number;


  patientInfo: {

    appointments: Schema.Types.ObjectId[];

    basicInformation: {
      // fullName: string
      dateOfBirth: string
      gender: string
      languages: string[]
      contactInfo: {
        email: string
        zipCode: string
        phoneNumber: string
        address: string
      }
      emergencyContact: {
        name: string
        zipCode: string
        contactEmergencyPhoneNumber: string
        relationship: string
      }
    }
  
    healthMetrics: {
      basic: {
        height: string
        weight: string
        bodyMass: string
        bloodGroup: string
  
      }
  
      advancedIfo: {
        bloodPressure: string
        totalCholesterol: string
        LDL: string
        HDL: string
        triglycerides: string
        cholesterolHDLRatio: string
        glucose: string
  
      }
    }
  
    conditions: {
      name: string
      dateAdded: string
      diagnozedBy: string
      description: string
    }[]

    treatmentHistory: {
      name: string
      dateAdded: string
      diagnozedBy: string
      description: string
    }[]

    medications: {
      generalMedication: {
        name: string
        dosage: string

      }[]
      advancedMedication: {
        name: string
        dosage: string

      }[]
    }

    labResults: {
      name: string
      nameofLab: string
      dateAdded: string
      diagnozedBy: string
      image: [string]
      description: string
    }[]

    immunization: {
      name: string
      diagnozedBy: string
      description: string
    }[]

    clinicalVitals: {
      name: string
      diagnozedBy: string
      description: string
    }[]

    allergies: {
      name: string
      diagnozedBy: string
      description: string
    }[]


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



// Basic Information Schema
const basicInfoSchema: Schema = new Schema({


  dateOfBirth: stringDefault,
  gender: stringDefault,
  languages: {type: [String], default: []},
  contactInfo: {
    email: stringDefault,
    zipCode: stringDefault,
    emergencyPhoneNumber: stringDefault,
    address: stringDefault,
  },
  emergencyContact: {
    name: stringDefault,
    zipCode: stringDefault,
    contactEmergencyPhoneNumber: stringDefault,
    relationship: stringDefault,
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


// Health Metrics Schema
const healthMetricsSchema: Schema = new Schema({
  basic: {
    height: stringDefault,
    weight: stringDefault,
    bodyMass: stringDefault,
    bloodGroup: stringDefault,
  },
  advancedInfo: {
    bloodPressure: stringDefault,
    totalCholesterol: stringDefault,
    LDL: stringDefault,
    HDL: stringDefault,
    triglycerides: stringDefault,
    cholesterolHDLRatio: stringDefault,
    glucose: stringDefault,
  }
}, {
  toJSON: {
    transform(document, returnedObject) {
      delete returnedObject.__v;
      delete returnedObject._id;
      delete returnedObject.createdAt;
      delete returnedObject.updatedAt;
    }
  },
  timestamps: true
});


// Condition Schema
const conditionsSchema: Schema = new Schema({
  name: stringDefault,
  dateAdded: stringDefault,
  diagnozedBy: stringDefault,
  description: stringDefault,
}, {
  toJSON: {
    transform(document, returnedObject) {
      delete returnedObject.__v;
      delete returnedObject._id;
    }
  },
  timestamps: true
});

// Treatment History Schema
const treatmentHistorySchema: Schema = new Schema({
  name: stringDefault,
  diagnozedBy: stringDefault,
  description: stringDefault,
}, {
  toJSON: {
    transform(document, returnedObject) {
      delete returnedObject.__v;
      delete returnedObject._id;
    }
  },
  timestamps: true
});



// Medication Schema
const medicationSchema: Schema = new Schema({
  name: stringDefault,
  dosage: stringDefault,
}, {
  toJSON: {
    transform(document, returnedObject) {
      delete returnedObject.__v;
      delete returnedObject._id;
    }
  },
  timestamps: true
});

// Lab Result Schema
const labResultSchema: Schema = new Schema({
  name: stringDefault,
  nameofLab: stringDefault,
  dateAdded: stringDefault,
  diagnozedBy: stringDefault,
  image: [String],
  description: stringDefault,
}, {
  toJSON: {
    transform(document, returnedObject) {
      delete returnedObject.__v;
      delete returnedObject._id;
    }
  },
  timestamps: true
});


// Immunization Schema
const immunizationSchema: Schema = new Schema({
  name: stringDefault,
  diagnozedBy: stringDefault,
  description: stringDefault,
}, {
  toJSON: {
    transform(document, returnedObject) {
      delete returnedObject.__v;
      delete returnedObject._id;
    }
  },
  timestamps: true
});


// Clinical Vitals Schema
const clinicalVitalsSchema: Schema = new Schema({
  name: stringDefault,
  diagnozedBy: stringDefault,
  description: stringDefault,
}, {
  toJSON: {
    transform(document, returnedObject) {
      delete returnedObject.__v;
      delete returnedObject._id;
    }
  },
  timestamps: true
});


// Allergy Schema
const allergySchema: Schema = new Schema({
  name: stringDefault,
  diagnozedBy: stringDefault,
  description: stringDefault,
}, {
  toJSON: {
    transform(document, returnedObject) {
      delete returnedObject.__v;
      delete returnedObject._id;
    }
  },
  timestamps: true
});






// Patient Info Schema
const patientInfoSchema: Schema = new Schema({
  appointments: [{ type: Schema.Types.ObjectId, ref: 'appointment' }],

  basicInformation: basicInfoSchema,
  healthMetrics: healthMetricsSchema,
  conditions: [conditionsSchema],

  treatmentHistory: [treatmentHistorySchema],
  medications: {
    generalMedication: [medicationSchema],
    advancedMedication: [medicationSchema],
  },

  labResults: [labResultSchema],
  immunization: [immunizationSchema],
  clinicalVitals: [clinicalVitalsSchema],
  allergies: [allergySchema],
  
}, {
  toJSON: {
    transform(document, returnedObject) {
      delete returnedObject.__v;
      delete returnedObject._id;
      delete returnedObject.createdAt;
      delete returnedObject.updatedAt;
    }
  },
  timestamps: true
});



const doctorInfoSchema: Schema = new Schema({

  fullName: stringDefault,
  specialty:stringDefault,
  address:stringDefault,

  clinicName:stringDefault,
  clinicLocation:stringDefault,
  consultationFee: numberDefault,

  workingHours:stringDefault,
  appointments: [{ type: mongoose.Types.ObjectId, ref: 'appointment' }]

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

  phoneNumber: {
    type: String,
    unique: true,
    required: true,
  },
  patientID: {
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

  latitude: {
    type: Number,
    default: null, 
  },
  longitude: {
    type: Number,
    default: null, 
  },

  firstName: stringDefault,
  lastName: stringDefault,
  country: stringDefault,
  state: stringDefault,


  basicInformation : basicInfoSchema,
  patientInfo: patientInfoSchema,
  doctorInfo: doctorInfoSchema,

  avatar: {
    type: String,
    default: 'https://res.cloudinary.com/virtualsavvyng/image/upload/v1681556292/realties/user1_xhiugc.png'
},


},{
    toJSON: {
        transform(document, returnedObject) {
          returnedObject.id = returnedObject._id.toString();


          delete returnedObject._id;
          delete returnedObject.__v;
          delete returnedObject.createdAt;
          delete returnedObject.updatedAt;
          delete returnedObject.password;
    

          switch (returnedObject.role) {
            case 'doctor':
              delete returnedObject.patientInfo;
              break;
            case 'patient':
              delete returnedObject.doctorInfo;
              break;
            case 'user':
              delete returnedObject.doctorInfo;
              break;
            case 'admin':

            break;
            default:

            delete returnedObject.doctorInfo;
              // delete returnedObject.patientInfo;
              break;
          }

        }
    },
    timestamps:true
});





export default mongoose.model<IUser>('user', UserSchema);
