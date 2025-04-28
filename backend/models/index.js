
const sequelize = require('../config/database');
const Item = require('./Item');

// Define associations here if needed
// For example: User.hasMany(Item);

module.exports = {
  sequelize,
  Item
};
