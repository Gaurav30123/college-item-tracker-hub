
const sequelize = require('../config/database');
const Item = require('./Item');
const User = require('./User');
const Notification = require('./Notification');

// Define associations
User.hasMany(Item, { foreignKey: 'userId', onDelete: 'CASCADE' });
Item.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  Item,
  User,
  Notification
};
