

import mongoose, { Document, Schema, Types } from 'mongoose';
import { stringDefault } from '../../types/schemaTypes';


interface IFreeHealthQues extends Document {
    user: Types.ObjectId;
    medications: string;
    allergies: string;
    previouslyDiagnosed: string;
    question: string;

    condition: {
        conditionName: string
        conditionTime: string
        optionalNote: string
    }

    someoneElse: {
        firstName: string
        lastName: string
        relationship: string
        dateOfBirth: Date
    }

    answers: Types.ObjectId[]

}





const FreeHealthQuesSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    medications: stringDefault,
    allergies: stringDefault,
    previouslyDiagnosed: stringDefault,
    question: stringDefault,

    condition: {
        conditionName: stringDefault,
        conditionTime: stringDefault,
        optionalNote: stringDefault,
    },

    someoneElse: {
        firstName: stringDefault,
        lastName: stringDefault,
        relationship: stringDefault,
        dateOfBirth: { type: Date, default: null },
    }, 

    answers: [{ type: Schema.Types.ObjectId, ref: 'answer' }]
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







export default mongoose.model<IFreeHealthQues>('freeHealthQues', FreeHealthQuesSchema);

   
