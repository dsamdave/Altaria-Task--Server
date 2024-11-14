import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: 'appointment' | 'prescription' | 'alert' | 'message';
  recipientId: mongoose.Types.ObjectId; // Refers to the User schema
  recipientRole: 'patient' | 'doctor';
  isRead: boolean;
  data?: Record<string, any>; // Optional field for additional details
  readAt?: Date;
}

const NotificationSchema: Schema = new Schema<INotification>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['appointment', 'prescription', 'alert', 'message'],
    required: true,
  },
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipientRole: {
    type: String,
    enum: ['patient', 'doctor'],
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    required: false,
  },

  readAt: {
    type: Date,
  },
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



export default mongoose.model<INotification>('notification', NotificationSchema);
