const mongoose = require("mongoose");
const Joi = require("joi");

const associateSchema = new mongoose.Schema({
  dentist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Associate = mongoose.model("Associate", associateSchema);

const assocschema = Joi.object({
  firstName: Joi.string().min(3).max(50).required(),
  lastName: Joi.string().min(3).max(50).required(),
}).options({ stripUnknown: true });

const validator = (schema) => (req) => schema.validate(req);

exports.Associate = Associate;

exports.validateAssoc = validator(assocschema);
