
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Create a new notification
router.post('/', notificationController.createNotification);

// Get notifications for a specific user
router.get('/user/:userId', notificationController.getUserNotifications);

// Mark notification as read
router.put('/:id/read', notificationController.markAsRead);

// Delete a notification
router.delete('/:id', notificationController.deleteNotification);

// Send email notification
router.post('/email', notificationController.sendEmailNotification);

module.exports = router;
