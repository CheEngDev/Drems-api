const mongoose = require("mongoose");
const Joi = require("joi").extend(require("@joi/date"));

const otherexpensesSchema = new mongoose.Schema({
  dentist: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  description: { type: String, requured: true, minlength: 5, maxlength: 50 },
  amount: { type: Number, requured: true, min: 5, max: 20000 },
  date: { type: Date, required: true },
});

const OtherExpense = mongoose.model("OtherExpense", otherexpensesSchema);

const otherexpensesschema = Joi.object({
  description: Joi.string().min(5).max(50).required(),
  amount: Joi.number().min(5).max(100000).required(),
  date: Joi.date().format("YYYY/MM/DD").required(),
}).options({ stripUnknown: true });

const validator = (schema) => (req) => schema.validate(req);

exports.OtherExpense = OtherExpense;

exports.validateOtherExpense = validator(otherexpensesschema);
