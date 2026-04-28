const { sequelize } = require('../db');
const { DataTypes } = require('sequelize');

const Major = sequelize.define('Major', {
  Major_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Dept_ID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  MajorName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'MAJORS',
  timestamps: false
});

module.exports = Major;