
const sequelize = require('../config/database');
const Item = require('./Item');
const User = require('./User');
const Notification = require('./Notification');

// Define associations
Item.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Item, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  Item,
  User,
  Notification
};
