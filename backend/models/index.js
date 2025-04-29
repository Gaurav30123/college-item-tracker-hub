
const sequelize = require('../config/database');
const Item = require('./Item');
const User = require('./User');

// Define associations
Item.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Item, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  Item,
  User
};
