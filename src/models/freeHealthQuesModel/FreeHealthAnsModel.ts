import mongoose, { Document, Schema,  Types } from 'mongoose';



interface IFreeHealthAnswers extends Document {

    question: Types.ObjectId;
    doctor: Types.ObjectId;
    content: string;

} 


const FreeHealthAnswersSchema: Schema = new Schema({

    question: { type: Schema.Types.ObjectId, ref: 'freeHealthQues', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    content: { type: String, required: true },

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




export default mongoose.model<IFreeHealthAnswers>('answer', FreeHealthAnswersSchema);



