
const { Item } = require('../models');
const { Op } = require('sequelize');

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
    const [updated] = await Item.update(req.body, {
      where: { id: req.params.id }
    });
    
    if (updated === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    const updatedItem = await Item.findByPk(req.params.id);
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

// Find potential matches
exports.findMatches = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Find opposite type items (lost vs found)
    const oppositeType = item.itemType === 'lost' ? 'found' : 'lost';
    
    const matches = await Item.findAll({
      where: {
        itemType: oppositeType,
        category: item.category,
        // Add more advanced matching logic as needed
      },
      limit: 5,
      order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json(matches);
  } catch (error) {
    console.error('Error finding matches:', error);
    return res.status(500).json({ message: 'Failed to find matches', error: error.message });
  }
};
