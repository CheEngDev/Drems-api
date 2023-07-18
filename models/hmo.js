const mongoose = require("mongoose");
const Joi = require("joi");

const hmoSchema = new mongoose.Schema({
  dentist: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
  },
  number: {
    type: String,
    minlength: 11,
    maxlength: 11,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Hmo = mongoose.model("Hmo", hmoSchema);

const hmoschema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  number: Joi.string().min(5).max(50).required(),
}).options({ stripUnknown: true });

const validator = (schema) => (req) => schema.validate(req);

exports.Hmo = Hmo;

exports.validateHmo = validator(hmoschema);
