const Student = require('./Student');
const Lecturer = require('./Lecturer');
const { AppointmentModel } = require('./Appointment');
const AvailableSlot = require('./AvailableSlot');
const User = require('./User2');
const Department = require('./Department');
const Major = require('./Major');

// -------------------- Associations --------------------

// Student ↔ User
Student.belongsTo(User, { foreignKey: 'User_ID', as: 'StudentUser' });
User.hasOne(Student, { foreignKey: 'User_ID', as: 'StudentProfile' });

// Student ↔ Major
Student.belongsTo(Major, { foreignKey: 'Major_ID', as: 'StudentMajor' });
Major.hasMany(Student, { foreignKey: 'Major_ID', as: 'Students' });

// Lecturer ↔ User
Lecturer.belongsTo(User, { foreignKey: 'User_ID', as: 'LecturerUser' });
User.hasOne(Lecturer, { foreignKey: 'User_ID', as: 'LecturerProfile' });

// Lecturer ↔ Department
Lecturer.belongsTo(Department, { foreignKey: 'Dept_ID', as: 'LecturerDepartment' });
Department.hasMany(Lecturer, { foreignKey: 'Dept_ID', as: 'Lecturers' });

// Lecturer ↔ Major
Lecturer.belongsTo(Major, { foreignKey: 'Major_ID', as: 'LecturerMajor' });
Major.hasMany(Lecturer, { foreignKey: 'Major_ID', as: 'Lecturers' });

// Major ↔ Department
Major.belongsTo(Department, { foreignKey: 'Dept_ID', as: 'MajorDepartment' });
Department.hasMany(Major, { foreignKey: 'Dept_ID', as: 'Majors' });

// Student ↔ Appointment
Student.hasMany(AppointmentModel, { foreignKey: 'Student_ID', as: 'StudentAppointments' });
AppointmentModel.belongsTo(Student, { foreignKey: 'Student_ID', as: 'AppointmentStudent' });

// Lecturer ↔ Appointment
Lecturer.hasMany(AppointmentModel, { foreignKey: 'Lecturer_ID', as: 'LecturerAppointments' });
AppointmentModel.belongsTo(Lecturer, { foreignKey: 'Lecturer_ID', as: 'AppointmentLecturer' });

// Lecturer ↔ AvailableSlot
Lecturer.hasMany(AvailableSlot, { foreignKey: 'Lecturer_ID', as: 'LecturerSlots' });
AvailableSlot.belongsTo(Lecturer, { foreignKey: 'Lecturer_ID', as: 'SlotLecturer' });

// Appointment ↔ AvailableSlot
AppointmentModel.belongsTo(AvailableSlot, { foreignKey: 'Slot_ID', as: 'AvailableSlot' });
AvailableSlot.hasMany(AppointmentModel, { foreignKey: 'Slot_ID', as: 'SlotAppointments' });

// Appointment ↔ User (AdjustedBy)
AppointmentModel.belongsTo(User, { foreignKey: 'AdjustedBy', as: 'AdjustedUser' });
User.hasMany(AppointmentModel, { foreignKey: 'AdjustedBy', as: 'AdjustedAppointments' });

// ------------------------------------------------------

module.exports = {
  Student,
  Lecturer,
  AppointmentModel,
  AvailableSlot,
  User,
  Department,
  Major
};