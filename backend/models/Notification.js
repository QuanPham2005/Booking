const { sequelize } = require('../db');
const { DataTypes } = require('sequelize');

const Notification = sequelize.define('Notification', {
  Noti_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Admin_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  Target_Role: {
    type: DataTypes.ENUM('Student', 'Lecturer', 'All'),
    allowNull: false,
    defaultValue: 'All',
  },
  Created_At: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'NOTIFICATIONS',
  timestamps: false,
});

module.exports = Notification;
