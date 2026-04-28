const { sequelize } = require('../db');
const { DataTypes } = require('sequelize');
const UserModel = require('./User2');
const Department = require('./Department');
const Major = require('./Major');

const LecturerModel = sequelize.define('Lecturer', {
  Lecturer_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  User_ID: { type: DataTypes.INTEGER, unique: true },
  Email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  Full_Name: { type: DataTypes.STRING(100), allowNull: false },
  picture: { type: DataTypes.TEXT('long'), allowNull: true }, // Match existing column name
  Phone: { type: DataTypes.STRING(20), allowNull: true }, // Số điện thoại
  Academic_Rank: { type: DataTypes.STRING(100), allowNull: true }, // Học hàm/học vị
  Office_Room: { type: DataTypes.STRING(50), allowNull: true }, // Phòng làm việc
  Specialization: { type: DataTypes.STRING(200), allowNull: true }, // Lĩnh vực chuyên môn
  Bio: { type: DataTypes.TEXT, allowNull: true }, // Giới thiệu bản thân
  Dept_ID: { type: DataTypes.INTEGER },
  Major_ID: { type: DataTypes.INTEGER }
}, {
  tableName: 'LECTURER',
  timestamps: false
});

LecturerModel.belongsTo(UserModel, { foreignKey: 'User_ID' });
UserModel.hasOne(LecturerModel, { foreignKey: 'User_ID' });
LecturerModel.belongsTo(Department, { foreignKey: 'Dept_ID' });
LecturerModel.belongsTo(Major, { foreignKey: 'Major_ID' });

module.exports = LecturerModel;