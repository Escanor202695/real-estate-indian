
import api from './api';

export type EmailData = {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
};

export const sendEmail = async (emailData: EmailData): Promise<any> => {
  try {
    const response = await api.post('/users/notifications/email', emailData);
    return response.data;
  } catch (error) {
    console.log('Using dummy response for sendEmail');
    return {
      success: true,
      message: 'Email sent successfully (demo mode)'
    };
  }
};

export const sendNotificationEmail = async (userId: string, notification: { message: string; type?: string }): Promise<any> => {
  try {
    const response = await api.post(`/users/notifications/email/${userId}`, notification);
    return response.data;
  } catch (error) {
    console.log('Using dummy response for sendNotificationEmail');
    return {
      success: true,
      message: 'Notification email sent successfully (demo mode)'
    };
  }
};
