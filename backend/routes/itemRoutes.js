
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Create a new item
router.post('/', itemController.createItem);

// Get all items (with optional filters)
router.get('/', itemController.getItems);

// Get a single item by ID
router.get('/:id', itemController.getItemById);

// Update an item
router.put('/:id', itemController.updateItem);

// Delete an item
router.delete('/:id', itemController.deleteItem);

// Find potential matches
router.get('/:id/matches', itemController.findMatches);

module.exports = router;
