
import { Notification } from "@/types";

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Get user notifications
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/user/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    // Return mock notifications for development
    return getMockNotifications(userId);
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PUT'
    });
    if (!response.ok) {
      throw new Error('Failed to update notification');
    }
  } catch (error) {
    console.error('Error updating notification:', error);
  }
};

// Create a new notification
export const createNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<Notification | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create notification');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Send email notification
export const sendEmailNotification = async (
  email: string, 
  subject: string, 
  message: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject,
        message
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    console.log(`Would send email to ${email} with subject: ${subject}`);
    return false;
  }
};

// Helper function to generate mock notifications
export const getMockNotifications = (userId: string): Notification[] => {
  return [
    {
      id: 'notif-1',
      userId,
      title: 'Item Verified',
      message: 'Your report for "iPhone 12" has been verified by an administrator.',
      type: 'item_verified',
      itemId: 'lost-1',
      createdAt: new Date().toISOString(),
      read: false
    },
    {
      id: 'notif-2',
      userId,
      title: 'Potential Match Found',
      message: 'We found a potential match for your lost "Laptop Bag".',
      type: 'item_found',
      itemId: 'lost-2',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      read: true
    },
    {
      id: 'notif-3',
      userId,
      title: 'Item Claimed',
      message: 'Someone has claimed the "Silver Watch" you reported as found.',
      type: 'item_claimed',
      itemId: 'found-1',
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      read: false
    }
  ];
};
