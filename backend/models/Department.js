const { sequelize } = require('../db');
const { DataTypes } = require('sequelize');

const Department = sequelize.define('Department', {
  Dept_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  DeptName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'DEPARTMENTS',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['DeptName']
    }
  ]
});

module.exports = Department;