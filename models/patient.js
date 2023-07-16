const mongoose = require("mongoose");
const Joi = require("joi");

const pxSchema = new mongoose.Schema({
  dentist: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  age: {
    type: Number,
    required: true,
    min: 5,
    max: 99,
  },
  sex: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
  },
  email: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 11,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  pxPicUrl: {
    type: String,
  },
  lastVisit: {
    type: Date,
    default: Date.now,
  },
});

const Patient = mongoose.model("Patient", pxSchema);

const pxschema = Joi.object({
  firstName: Joi.string().min(5).max(50).required(),
  lastName: Joi.string().min(5).max(50).required(),
  age: Joi.number().min(5).max(99).required(),
  sex: Joi.string().valid("Male", "Female").required(),
  email: Joi.string().min(5).max(50).required().email(),
  number: Joi.string().min(11).max(11).required(),
  pxPicUrl: Joi.string(),
}).options({ stripUnknown: true });

const validator = (schema) => (req) => schema.validate(req);

exports.Patient = Patient;

exports.validatePx = validator(pxschema);
