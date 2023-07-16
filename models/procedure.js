const mongoose = require("mongoose");
const Joi = require("joi");

const procedureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 5,
    max: 50,
  },
  amount: {
    type: Number,
    required: true,
    min: 100,
    max: 80000,
  },
  dentist: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const Procedure = mongoose.model("Procedure", procedureSchema);

const procedureschema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  amount: Joi.number().min(100).max(80000).required(),
}).options({ stripUnknown: true });

const validator = (schema) => (req) => schema.validate(req);

exports.Procedure = Procedure;

exports.validateProc = validator(procedureschema);
