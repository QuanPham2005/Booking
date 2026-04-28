const { sequelize } = require('../db');
const { DataTypes } = require('sequelize');

const Student = sequelize.define('Student', {
  Student_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: false,
    allowNull: false
  },
  User_ID: {
    type: DataTypes.INTEGER,
    unique: true
  },
  Major_ID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  Full_Name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  ClassName: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'STUDENT', // kiểm tra lại trong DB, nếu là STUDENTS thì sửa
  timestamps: false
});

module.exports = Student;