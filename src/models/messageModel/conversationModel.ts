import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  participants: string[]; // Array of user IDs
  lastMessage: string;
  lastMessageTime: Date;
  doctor: Schema.Types.ObjectId;
  patient: Schema.Types.ObjectId;
  sender: Schema.Types.ObjectId;
  recipient: Schema.Types.ObjectId;
}

const ConversationSchema: Schema = new Schema({
  participants: [{ type: String, required: true }],
  lastMessage: { type: String, required: true },
  lastMessageTime: { type: Date, default: Date.now },
  doctor: { type: Schema.Types.ObjectId, ref: "user", required: true },
  patient: { type: Schema.Types.ObjectId, ref: "user", required: true },
  sender: { type: Schema.Types.ObjectId, ref: "user", required: true },
  recipient: { type: Schema.Types.ObjectId, ref: "user", required: true },


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



export default mongoose.model<IConversation>('conversation', ConversationSchema);


