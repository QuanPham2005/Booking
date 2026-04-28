const { sequelize } = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
  ID: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  Username: { 
    type: DataTypes.STRING(50), 
    allowNull: false
  },
  Password: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  Role: { 
    type: DataTypes.ENUM('Admin','Student','Lecturer'), 
    allowNull: false 
  },
  Status: { 
    type: DataTypes.ENUM('Active','Locked'), 
    defaultValue: 'Active' 
  },
  loginAttempts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'USERS',   // kiểm tra lại trong DB, nếu là USER thì sửa
  timestamps: false
});

module.exports = User;