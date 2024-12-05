import mongoose, { Document, Schema } from 'mongoose';

export interface IChat extends Document {
  sender: Schema.Types.ObjectId;
  recipient: Schema.Types.ObjectId;
  message: string;
  timestamp: Date;
}

const ChatSchema: Schema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "user", required: true },
  recipient: { type: Schema.Types.ObjectId, ref: "user", required: true },
  message: { type: String },

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

export default mongoose.model<IChat>('chat', ChatSchema);
