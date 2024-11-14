import Notification, { INotification } from '../models/notificationsModel';

/**
 * Utility to create a notification
 * @param {string} title - The title of the notification
 * @param {string} message - The message body of the notification
 * @param {'appointment' | 'prescription' | 'alert' | 'message'} type - The type of notification
 * @param {mongoose.Types.ObjectId} recipientId - The recipient user ID
 * @param {'patient' | 'doctor'} recipientRole - The role of the recipient
 * @param {Record<string, any>} [data] - Additional contextual data
 */


export const createNotification = async ({
  title,
  message,
  type,
  recipientId,
  recipientRole,
  data,
}: {
  title: string;
  message: string;
  type: 'appointment' | 'prescription' | 'alert' | 'message';
  recipientId: string;
  recipientRole: 'patient' | 'doctor';
  data?: Record<string, any>;
}): Promise<INotification | null> => {
  try {
    const notification = new Notification({
      title,
      message,
      type,
      recipientId,
      recipientRole,
      data,
    });
    return await notification.save();
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};
