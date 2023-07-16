const mongoose = require("mongoose");
const Joi = require("joi").extend(require("@joi/date"));

trecSchema = new mongoose.Schema({
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
  teeth: {
    type: Number,
    required: true,
    minlength: 1,
    maxlength: 3,
  },
  date: {
    type: Date,
    required: true,
  },
  procedure: {
    type: mongoose.Types.ObjectId,
    ref: "Procedure",
    required: true,
  },
  notes: {
    type: String,
    max: 50,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  handledby: {
    type: mongoose.Types.ObjectId,
    ref: "Associate",
    required: true,
  },
});

const Treatmentrec = mongoose.model("TreatmentRecord", trecSchema);

trecschema = Joi.object({
  teeth: Joi.number().max(32).required(),
  date: Joi.date().format("YYYY/MM/DD").required(),
  procedure: Joi.string().required(),
  notes: Joi.string(),
  handledby: Joi.objectId().required(),
}).options({ stripUnknown: true });

const validator = (schema) => (req) => schema.validate(req);

exports.validaterec = validator(trecschema);
exports.Treatmentrec = Treatmentrec;
