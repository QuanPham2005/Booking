const { sequelize } = require('../db');
const { DataTypes } = require('sequelize');

const AvailableSlotModel = sequelize.define('AvailableSlot', {
  Slot_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Lecturer_ID: { type: DataTypes.INTEGER },
  Date: { type: DataTypes.DATEONLY, allowNull: false },
  StartTime: { type: DataTypes.TIME, allowNull: false },
  EndTime: { type: DataTypes.TIME, allowNull: false },
  IsBooked: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'AVAILABLE_SLOTS',
  timestamps: false
});

module.exports = AvailableSlotModel;
