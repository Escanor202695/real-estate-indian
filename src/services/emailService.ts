
import api from './api';

export type EmailData = {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
};

export const sendEmail = async (emailData: EmailData): Promise<any> => {
  try {
    const response = await api.post('/api/users/notifications/email', emailData);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendNotificationEmail = async (userId: string, notification: { message: string; type?: string }): Promise<any> => {
  try {
    const response = await api.post(`/api/users/notifications/email/${userId}`, notification);
    return response.data;
  } catch (error) {
    console.error('Error sending notification email:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<any> => {
  try {
    const emailData = {
      to: email,
      subject: 'Welcome to ClickProp Real Estate',
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <h2 style="color: #2563eb;">Welcome to ClickProp Real Estate!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for joining ClickProp - your new home for finding the perfect property.</p>
          <p>With your new account, you can:</p>
          <ul>
            <li>Save your favorite properties</li>
            <li>Set up property alerts</li>
            <li>Track your search history</li>
            <li>Contact property owners directly</li>
          </ul>
          <p>Start exploring now!</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/properties" 
             style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">
            Browse Properties
          </a>
          <p style="margin-top: 20px;">If you have any questions, feel free to contact our support team.</p>
          <p>Happy house hunting!</p>
          <p>The ClickProp Team</p>
        </div>
      `,
      isHtml: true
    };
    
    return await sendEmail(emailData);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string, otp: string): Promise<any> => {
  try {
    const emailData = {
      to: email,
      subject: 'Reset Your ClickProp Password',
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>You requested to reset your password for your ClickProp account.</p>
          <p>Please use the following verification code to reset your password:</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <div style="font-size: 24px; letter-spacing: 5px; font-weight: bold; padding: 15px; background-color: #f3f4f6; border-radius: 4px; display: inline-block;">
              ${otp}
            </div>
          </div>
          
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request to reset your password, please ignore this email or contact our support team if you have concerns.</p>
          
          <p style="margin-top: 20px;">Thanks,<br>The ClickProp Team</p>
        </div>
      `,
      isHtml: true
    };
    
    return await sendEmail(emailData);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

export const sendNewAccountEmail = async (email: string, name: string, password: string): Promise<any> => {
  try {
    const emailData = {
      to: email,
      subject: 'Your New ClickProp Account',
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <h2 style="color: #2563eb;">Welcome to ClickProp Real Estate!</h2>
          <p>Hello ${name},</p>
          <p>An administrator has created a new account for you on ClickProp Real Estate.</p>
          <p>Here are your login details:</p>
          <div style="padding: 15px; background-color: #f3f4f6; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${password}</p>
          </div>
          <p>Please log in using these credentials and change your password immediately.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
             style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">
            Login Now
          </a>
          <p style="margin-top: 20px;">If you have any questions, feel free to contact our support team.</p>
          <p>Welcome aboard!</p>
          <p>The ClickProp Team</p>
        </div>
      `,
      isHtml: true
    };
    
    return await sendEmail(emailData);
  } catch (error) {
    console.error('Error sending new account email:', error);
    throw error;
  }
};

export const sendPropertyAlertEmail = async (email: string, name: string, properties: any[], searchCriteria: any): Promise<any> => {
  try {
    let propertiesHtml = '';
    
    properties.forEach(property => {
      propertiesHtml += `
        <div style="margin-bottom: 15px; border-bottom: 1px solid #e1e1e1; padding-bottom: 15px;">
          <h3 style="margin: 0 0 5px 0;">${property.title}</h3>
          <p style="margin: 0 0 5px 0;">${property.location.address}, ${property.location.city}</p>
          <p style="margin: 0 0 5px 0;">${property.bedrooms} bed | ${property.bathrooms} bath | ${property.size} sq ft</p>
          <p style="margin: 0 0 10px 0; font-weight: bold;">₹${property.price.toLocaleString()}</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/property/${property._id}" 
             style="color: #2563eb; text-decoration: none;">
            View Property
          </a>
        </div>
      `;
    });

    // Build search criteria text
    let criteriaText = 'Location: ' + (searchCriteria.location || 'Any');
    
    if (searchCriteria.propertyType && searchCriteria.propertyType !== 'all') {
      criteriaText += ` | Type: ${searchCriteria.propertyType}`;
    }
    
    if (searchCriteria.status && searchCriteria.status !== 'all') {
      criteriaText += ` | For: ${searchCriteria.status === 'sale' ? 'Sale' : 'Rent'}`;
    }

    const emailData = {
      to: email,
      subject: `New Properties Matching Your Search: ${searchCriteria.location || 'Property Alert'}`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <h2 style="color: #2563eb;">New Properties Found!</h2>
          <p>Hello ${name},</p>
          <p>We've found ${properties.length} new properties matching your saved search:</p>
          <p style="padding: 8px 12px; background-color: #f3f4f6; border-radius: 4px; font-size: 14px;">${criteriaText}</p>
          
          <div style="margin-top: 20px;">
            ${propertiesHtml}
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/properties?${new URLSearchParams(searchCriteria).toString()}" 
               style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View All Matching Properties
            </a>
          </div>
          
          <p style="margin-top: 20px; font-size: 12px; color: #6b7280; text-align: center;">
            You are receiving this email because you set up a property alert on ClickProp.
            <br>
            To manage your alerts, visit your <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/saved-searches" style="color: #2563eb;">account settings</a>.
          </p>
        </div>
      `,
      isHtml: true
    };
    
    return await sendEmail(emailData);
  } catch (error) {
    console.error('Error sending property alert email:', error);
    throw error;
  }
};

export const sendBugReportEmail = async (adminEmail: string, bugReport: any): Promise<any> => {
  try {
    const emailData = {
      to: adminEmail,
      subject: `New Bug Report: ${bugReport.title || 'Bug Report'}`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <h2 style="color: #2563eb;">New Bug Report Submitted</h2>
          
          <div style="margin-top: 20px; background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
            <h3 style="margin-top: 0;">${bugReport.title || 'No Title'}</h3>
            <p><strong>Reported by:</strong> ${bugReport.reporterName || 'Anonymous'} (${bugReport.reporterEmail || 'No email'})</p>
            <p><strong>Severity:</strong> ${bugReport.severity || 'Not specified'}</p>
            <p><strong>Date Reported:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Description:</strong></p>
            <div style="background-color: white; padding: 10px; border-radius: 5px;">
              ${bugReport.description || 'No description provided'}
            </div>
            
            ${bugReport.steps ? `
              <p><strong>Steps to Reproduce:</strong></p>
              <div style="background-color: white; padding: 10px; border-radius: 5px;">
                ${bugReport.steps}
              </div>
            ` : ''}
          </div>
          
          <p style="margin-top: 20px;">Please review this bug report in your admin dashboard.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/bugs" 
             style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">
            View in Admin Panel
          </a>
          
          <p style="margin-top: 20px;">The ClickProp Team</p>
        </div>
      `,
      isHtml: true
    };
    
    return await sendEmail(emailData);
  } catch (error) {
    console.error('Error sending bug report email:', error);
    throw error;
  }
};
