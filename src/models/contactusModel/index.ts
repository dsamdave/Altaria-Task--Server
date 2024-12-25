import mongoose, { Document, Schema } from 'mongoose';
import { reqString, stringDefault } from '../../types/schemaTypes';

export interface IContactUs extends Document {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

const contactUsSchema = new Schema<IContactUs>({

  firstName: stringDefault,
  lastName: stringDefault,
  email: reqString,
  message: reqString,

},{
    toJSON: {
        transform(document, returnedObject) {
          returnedObject.id = returnedObject._id.toString();
          delete returnedObject._id;
          delete returnedObject.__v;
        }
    },
    timestamps:true
});

export default mongoose.model<IContactUs>('contactus', contactUsSchema);
