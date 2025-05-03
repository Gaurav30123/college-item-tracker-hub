
const { Item } = require('../models');
const { Op } = require('sequelize');
const notificationController = require('./notificationController');

// Create a new item
exports.createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    return res.status(201).json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    return res.status(500).json({ message: 'Failed to create item', error: error.message });
  }
};

// Get all items (with optional filters)
exports.getItems = async (req, res) => {
  try {
    const { itemType, category, startDate, endDate, query } = req.query;
    
    // Build filter conditions
    const whereConditions = {};
    
    if (itemType) {
      whereConditions.itemType = itemType;
    }
    
    if (category) {
      whereConditions.category = category;
    }
    
    // Date filter
    if (startDate || endDate) {
      whereConditions.date = {};
      if (startDate) {
        whereConditions.date[Op.gte] = startDate;
      }
      if (endDate) {
        whereConditions.date[Op.lte] = endDate;
      }
    }
    
    // Search query
    if (query) {
      whereConditions[Op.or] = [
        { title: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
        { location: { [Op.iLike]: `%${query}%` } }
      ];
    }
    
    const items = await Item.findAll({
      where: whereConditions,
      order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json(items);
  } catch (error) {
    console.error('Error getting items:', error);
    return res.status(500).json({ message: 'Failed to fetch items', error: error.message });
  }
};

// Get a single item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    return res.status(200).json(item);
  } catch (error) {
    console.error('Error getting item by ID:', error);
    return res.status(500).json({ message: 'Failed to fetch item', error: error.message });
  }
};

// Update an item
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    const previousStatus = item.status;
    const [updated] = await Item.update(req.body, {
      where: { id: req.params.id }
    });
    
    if (updated === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    const updatedItem = await Item.findByPk(req.params.id);
    
    // Send notifications based on status changes
    if (updatedItem && previousStatus !== updatedItem.status) {
      await handleStatusChangeNotification(updatedItem, previousStatus);
    }
    
    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    return res.status(500).json({ message: 'Failed to update item', error: error.message });
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  try {
    const deleted = await Item.destroy({
      where: { id: req.params.id }
    });
    
    if (deleted === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
};

// Verify an item
exports.verifyItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    await Item.update({ status: 'verified' }, {
      where: { id: req.params.id }
    });
    
    const updatedItem = await Item.findByPk(req.params.id);
    
    // Send notification to user
    await notificationController.notifyUser(
      item.userId,
      'Item Verified',
      `Your ${item.itemType === 'lost' ? 'lost' : 'found'} item "${item.title}" has been verified by an administrator.`,
      'item_verified',
      item.id
    );
    
    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error verifying item:', error);
    return res.status(500).json({ message: 'Failed to verify item', error: error.message });
  }
};

// Find potential matches using enhanced matching algorithm
exports.findMatches = async (req, res) => {
  try {
    const { id } = req.params;
    const useML = req.query.useML === 'true'; // Query parameter to toggle ML matching
    
    const item = await Item.findByPk(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Find opposite type items (lost vs found)
    const oppositeType = item.itemType === 'lost' ? 'found' : 'lost';
    
    // Basic matching criteria (similar to frontend)
    let whereConditions = {
      itemType: oppositeType
    };
    
    // Add category filter for basic matching
    if (item.category) {
      whereConditions.category = item.category;
    }
    
    // Find potential matches
    const potentialMatches = await Item.findAll({
      where: whereConditions,
      limit: useML ? 20 : 5, // Get more items for ML matching to filter later
      order: [['createdAt', 'DESC']]
    });
    
    // If there are matches and this is a lost item, notify the user
    if (item.itemType === 'lost' && potentialMatches.length > 0) {
      // Send notification to user about potential matches
      await notificationController.notifyUser(
        item.userId,
        'Potential Match Found',
        `We've found ${potentialMatches.length} potential matches for your lost item "${item.title}". Check them out!`,
        'item_found',
        item.id
      );
    }
    
    return res.status(200).json({
      matches: potentialMatches,
      useML: useML
    });
  } catch (error) {
    console.error('Error finding matches:', error);
    return res.status(500).json({ message: 'Failed to find matches', error: error.message });
  }
};

// Claim an item
exports.claimItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { claimantId, claimantName, claimantContact } = req.body;
    
    const item = await Item.findByPk(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Update item status to claimed
    await Item.update(
      { 
        status: 'claimed',
        claimantInfo: JSON.stringify({
          id: claimantId,
          name: claimantName,
          contact: claimantContact,
          claimedAt: new Date().toISOString()
        })
      },
      { where: { id } }
    );
    
    const updatedItem = await Item.findByPk(id);
    
    // Send notification to the item owner
    await notificationController.notifyUser(
      item.userId,
      'Item Claimed',
      `Your ${item.itemType === 'found' ? 'found' : 'lost'} item "${item.title}" has been claimed by ${claimantName}.`,
      'item_claimed',
      item.id
    );
    
    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error claiming item:', error);
    return res.status(500).json({ message: 'Failed to claim item', error: error.message });
  }
};

// Helper function to handle status change notifications
const handleStatusChangeNotification = async (item, previousStatus) => {
  try {
    switch (item.status) {
      case 'verified':
        await notificationController.notifyUser(
          item.userId,
          'Item Verified',
          `Your ${item.itemType === 'lost' ? 'lost' : 'found'} item "${item.title}" has been verified by an administrator.`,
          'item_verified',
          item.id
        );
        break;
      case 'claimed':
        await notificationController.notifyUser(
          item.userId,
          'Item Claimed',
          `Your ${item.itemType === 'found' ? 'found' : 'lost'} item "${item.title}" has been claimed.`,
          'item_claimed',
          item.id
        );
        break;
      case 'resolved':
        await notificationController.notifyUser(
          item.userId,
          'Item Resolved',
          `Your ${item.itemType === 'lost' ? 'lost' : 'found'} item "${item.title}" has been marked as resolved.`,
          'system',
          item.id
        );
        break;
    }
  } catch (error) {
    console.error('Error sending status change notification:', error);
  }
};
