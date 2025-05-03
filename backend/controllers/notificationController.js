
const { Notification, User } = require('../models');
const nodemailer = require('nodemailer');

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    return res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    return res.status(500).json({ message: 'Failed to create notification', error: error.message });
  }
};

// Get notifications for a specific user
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const notifications = await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json(notifications);
  } catch (error) {
    console.error('Error getting notifications:', error);
    return res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const [updated] = await Notification.update(
      { read: true },
      { where: { id: req.params.id } }
    );
    
    if (updated === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    return res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error updating notification:', error);
    return res.status(500).json({ message: 'Failed to update notification', error: error.message });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.destroy({
      where: { id: req.params.id }
    });
    
    if (deleted === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    return res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({ message: 'Failed to delete notification', error: error.message });
  }
};

// Send email notification
exports.sendEmailNotification = async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    
    // In a production environment, you would configure this with real email credentials
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.example.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'user@example.com',
        pass: process.env.EMAIL_PASS || 'password'
      }
    });
    
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'no-reply@lostandfound.example.com',
      to,
      subject,
      html: message
    };
    
    // For development, just log the email instead of actually sending it
    if (process.env.NODE_ENV !== 'production') {
      console.log('Email would be sent:', mailOptions);
      return res.status(200).json({ message: 'Email notification simulated' });
    }
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    return res.status(200).json({ message: 'Email notification sent successfully' });
  } catch (error) {
    console.error('Error sending email notification:', error);
    return res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
};

// Helper function to send notification and email
exports.notifyUser = async (userId, title, message, type, itemId = null) => {
  try {
    // Create notification in database
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      itemId,
      read: false
    });
    
    // Get user email to send notification
    const user = await User.findByPk(userId);
    
    if (user && user.email) {
      // In a real implementation, you would send an actual email
      console.log(`Notification email would be sent to ${user.email}:`);
      console.log(`Subject: ${title}`);
      console.log(`Message: ${message}`);
    }
    
    return notification;
  } catch (error) {
    console.error('Error creating notification for user:', error);
    return null;
  }
};
