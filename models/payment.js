const mongoose = require("mongoose");
const Joi = require("joi").extend(require("@joi/date"));

const paymentSchema = mongoose.Schema({
  dentist: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mop: {
    type: String,
    required: true,
    enum: ["Cash", "Online", "HMO"],
  },
  treatment: {
    type: new mongoose.Schema({
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
      procedure: {
        type: new mongoose.Schema({
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
        }),
      },
    }),
  },
  date: {
    type: Date,
    required: true,
  },
  handledby: {
    type: mongoose.Types.ObjectId,
    ref: "Associate",
    required: true,
  },
  company: {
    type: mongoose.Types.ObjectId,
    ref: "Hmo",
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

const paymentschema = Joi.object({
  mop: Joi.string().valid("Cash", "Online", "HMO").required(),
  treatment: Joi.objectId().required(),
  date: Joi.date().format("YYYY/MM/DD").required(),
  handledby: Joi.objectId().required(),
}).options({ stripUnknown: true });

const validator = (schema) => (req) => schema.validate(req);

exports.Payment = Payment;
exports.validatePayment = validator(paymentschema);
