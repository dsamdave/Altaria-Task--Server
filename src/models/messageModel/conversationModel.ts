import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  participants: string[]; // Array of user IDs
  lastMessage: string;
  lastMessageTime: Date;
}

const ConversationSchema: Schema = new Schema({
  participants: [{ type: String, required: true }],
  lastMessage: { type: String, required: true },
  lastMessageTime: { type: Date, default: Date.now },


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


