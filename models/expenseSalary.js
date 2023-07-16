const mongoose = require("mongoose");
const Joi = require("joi").extend(require("@joi/date"));

const expensesalarySchema = new mongoose.Schema({
  clinicOwner: {
    type: mongoose.Types.ObjectId,
    ref: "Associate",
    required: true,
  },
  dentist: { type: mongoose.Types.ObjectId, ref: "Associate", required: true },
  salary: { type: Number, requured: true, min: 5, max: 50000 },
  date: { type: Date, required: true },
});

const Salary = mongoose.model("Salary", expensesalarySchema);

const salaryschema = Joi.object({
  dentist: Joi.objectId().required(),
  salary: Joi.number().min(5).max(100000).required(),
  date: Joi.date().format("YYYY/MM/DD").required(),
});

const validator = (schema) => (req) => schema.validate(req);

exports.Salary = Salary;

exports.validateSalary = validator(salaryschema);
