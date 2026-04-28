const express = require('express');
const router = express.Router();

const { login, verifyToken } = require('../controllers/authController');
const {
  register,
  bookAppointment,
  getTeacherWithAppointments,
  registeredAppointments,
  getLecturerById,
  getLecturerSlots,
  getDepartments,
  cancelAppointment,
  getDashboardStats,
  getSlotById,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getSlotAppointments,
  getLecturers
} = require('../controllers/studentController');
const { getAllBookedAppointments } = require('../controllers/getAllBookedAppointments');

const { allow, getMajors, searchMajors } = require('../controllers/adminController');

router.post('/register', register);
router.post('/login', login);

router.get('/departments', verifyToken, allow('student'), getDepartments);

router.get('/lecturers', verifyToken, allow('student'), getLecturers);

router.get('/lecturers/:id', verifyToken, allow('student'), getLecturerById);
router.get('/lecturers/:id/slots', verifyToken, allow('student'), getLecturerSlots);

router.get('/slots/:id', verifyToken, allow('student'), getSlotById);
router.get('/slots/:id/appointments', verifyToken, allow('student'), getSlotAppointments);

router.patch('/appointments/:id', verifyToken, allow('student'), bookAppointment);
router.patch('/appointment/:id', verifyToken, allow('student'), bookAppointment);
router.delete('/appointments/:id', verifyToken, allow('student'), cancelAppointment);
router.delete('/appointment/:id', verifyToken, allow('student'), cancelAppointment);

router.get('/appointments/teachers', verifyToken, allow('student'), getTeacherWithAppointments);
router.get('/appointments/registered', verifyToken, allow('student'), registeredAppointments);
router.get('/appointments/all', verifyToken, allow('student'), getAllBookedAppointments);
router.get('/appointments/dashboard', verifyToken, allow('student'), getDashboardStats);

router.get('/notifications', verifyToken, allow('student'), getNotifications);
router.patch('/notifications/:id/read', verifyToken, allow('student'), markNotificationRead);
router.patch('/notifications/mark-all-read', verifyToken, allow('student'), markAllNotificationsRead);
router.post('/notifications/mark-all-read', verifyToken, allow('student'), markAllNotificationsRead);

router.get('/majors', verifyToken, allow('student'), getMajors);
router.get('/majors/search', verifyToken, allow('student'), searchMajors);

module.exports = router;