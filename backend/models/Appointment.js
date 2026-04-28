// This file provides a stable import path for appointment functionality.
// It re-exports the Sequelize model (`AppointmentModel`) and the legacy
// data-access wrapper (`Appointment`) defined in `Appointment2.js`.

const { AppointmentModel, Appointment } = require('./Appointment2');

module.exports = { AppointmentModel, Appointment };


