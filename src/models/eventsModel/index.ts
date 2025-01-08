import mongoose, { Schema, Document } from 'mongoose';
import { reqString } from '../../types/schemaTypes';

export interface IEvents extends Document {
  id: string;
  name: string;
  type: string;
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
  description: string;
  dateTime: string;
}

const eventSchema = new Schema(
  {
    name: reqString,
    type: reqString,
    address: reqString,
    coordinates: {
      type: [Number], // Store coordinates as an array [longitude, latitude]
      required: true,
      index: '2dsphere', // Create a 2dsphere index for geospatial queries
    },
    description: reqString,
    dateTime: reqString,
  },
  {
    timestamps: true,
    toJSON: {
      transform(document, returnedObject) {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
      },
    },
  }
);

mongoose.connection.once('open', () => {
  mongoose.model<IEvents>('Event').collection.createIndex({ coordinates: "2dsphere" });
});

export default mongoose.model<IEvents>('Event', eventSchema);
