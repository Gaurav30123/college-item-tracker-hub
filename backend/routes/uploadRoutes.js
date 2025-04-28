
const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Upload image route
router.post('/image', uploadController.uploadMiddleware, uploadController.uploadImage);

module.exports = router;
