const { sequelize } = require('../db');
const { DataTypes } = require('sequelize');

const NotificationRead = sequelize.define(
  'NotificationRead',
  {
    NotificationRead_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    User_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    NotificationKey: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    Read_At: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'NOTIFICATION_READS',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['User_ID', 'NotificationKey'],
      },
    ],
  }
);

module.exports = NotificationRead;
