
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  itemType: {
    type: DataTypes.ENUM('lost', 'found'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'verified', 'claimed', 'resolved'),
    defaultValue: 'pending'
  },
  contactInfo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,  // Changed from STRING to UUID to match User.id
    allowNull: false,
    references: {
      model: 'Users',  // Reference the Users table
      key: 'id'        // Reference the id column in Users table
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Fields specific to lost items
  lastSeen: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reward: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Fields specific to found items
  whereFound: {
    type: DataTypes.STRING,
    allowNull: true
  },
  storedLocation: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Item;
