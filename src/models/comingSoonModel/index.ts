import mongoose, { Schema, Document, model } from 'mongoose';

// User Notifications Model

interface ComingSoonDoc extends Document {

    fullName: string;
    email: string;
    phoneNumber: string;

    location: string
   
}

const comingSoonSchema = new Schema({

    fullName: {type: String, default: ""},
    email: {type: String, default: ""},
    phoneNumber: {type: String, default: ""},

    location: {type: String, default: ""},

},{
    toJSON: {
        transform(document, returnedObject) {
            returnedObject.id = returnedObject._id.toString(),
            delete returnedObject._id;
            delete returnedObject.__v;
        }
    },
    timestamps:true
});





export default model<ComingSoonDoc>('comingsoon', comingSoonSchema)