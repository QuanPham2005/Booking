const { sequelize } = require('../db');
const { DataTypes } = require('sequelize');
const UserModel = require('./User2');

const AdminModel = sequelize.define('Admin', {
  Admin_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Full_Name: { type: DataTypes.STRING(100), allowNull: false },
  User_ID: { type: DataTypes.INTEGER, unique: true }
}, {
  tableName: 'ADMIN',
  timestamps: false
});

AdminModel.belongsTo(UserModel, { foreignKey: 'User_ID' });
UserModel.hasOne(AdminModel, { foreignKey: 'User_ID' });

module.exports = AdminModel;
