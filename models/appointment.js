const Joi = require("joi").extend(require("@joi/date"));
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  dentist: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  patient: {
    type: mongoose.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  procedure: {
    type: mongoose.Types.ObjectId,
    ref: "Procedure",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  dentistOD: {
    type: mongoose.Types.ObjectId,
    ref: "Associate",
    required: true,
  },
  remarks: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Appointment = mongoose.model("Appointments", appointmentSchema);

const appointmentschema = Joi.object({
  patient: Joi.objectId().required(),
  procedure: Joi.objectId().required(),
  date: Joi.date().format("YYYY/MM/DD").required(),
  startTime: Joi.string()
    .regex(/\b((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm]))/)
    .required(),
  dentistOD: Joi.string().max(50).required(),
}).options({ stripUnknown: true });

const validator = (schema) => (req) => schema.validate(req);

exports.validateAppointment = validator(appointmentschema);

exports.Appointment = Appointment;
