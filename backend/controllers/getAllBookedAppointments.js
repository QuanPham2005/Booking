const catchAsync = require('../utils/catchAsync');

// Get all booked appointments for all students
const getAllBookedAppointments = catchAsync(async (req, res) => {
  // Import models directly
  const { AppointmentModel } = require('../models/Appointment');
  const AvailableSlot = require('../models/AvailableSlot');
  const Lecturer = require('../models/Lecturer');
  const User = require('../models/User2');
  const Student = require('../models/Student');
  const Major = require('../models/Major');
  const { Op } = require('sequelize');
  
  // Get all booked appointments (where Student_ID is not null)
  const rows = await AppointmentModel.findAll({
    where: {
      Student_ID: { [Op.ne]: null }
    },
    include: [
      {
        model: AvailableSlot,
        as: 'AvailableSlot',
        required: false,
        include: [
          {
            model: Lecturer,
            as: 'SlotLecturer',
            required: false,
            include: [
              {
                model: User,
                as: 'LecturerUser',
                required: false
              },
              {
                model: Major,
                as: 'LecturerMajor',
                required: false
              }
            ]
          }
        ]
      },
      {
        model: Student,
        as: 'AppointmentStudent',
        required: false,
        include: [
          {
            model: User,
            as: 'StudentUser',
            required: false
          }
        ]
      }
    ]
  });
  
  // Convert to legacy format
  const appointments = rows.map((row, idx) => {
    const p = row.get ? row.get({ plain: true }) : row;
    
    let scheduleAt;
    try {
      if (p.AvailableSlot && p.AvailableSlot.StartTime) {
        const date = new Date(p.AvailableSlot.Date);
        const [hours, minutes] = p.AvailableSlot.StartTime.split(':');
        date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        scheduleAt = date.toISOString();
      } else {
        scheduleAt = new Date().toISOString();
      }
    } catch (e) {
      scheduleAt = new Date().toISOString();
    }
    
    return {
      _id: p.Appointment_ID,
      name: p.AppointmentStudent?.StudentUser?.Name || 'Unknown Student',
      email: p.AppointmentStudent?.StudentUser?.Email || '',
      scheduleAt: scheduleAt,
      teacherId: p.AvailableSlot?.Lecturer_ID,
      teacherName: p.AvailableSlot?.SlotLecturer?.LecturerUser?.Name || 'Unknown Lecturer',
      studentName: p.AppointmentStudent?.StudentUser?.Name || 'Unknown Student',
      subject: p.AvailableSlot?.SlotLecturer?.LecturerMajor?.MajorName || '',
      department: p.AvailableSlot?.SlotLecturer?.Department || '',
      status: p.Status || 'booked'
    };
  });

  res.status(200).json({
    status: "SUCCESS",
    appointments: appointments
  });
});

module.exports = {
  getAllBookedAppointments
};
