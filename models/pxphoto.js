const Joi = require("joi");
const mongoose = require("mongoose");

pxphotoSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  patient: {
    type: mongoose.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  pxPhotoUrl: {
    type: String,
    required: true,
  },
});

const Pxphoto = mongoose.model("Pxphotos", pxphotoSchema);

const pxphotoschema = Joi.object({
  caption: Joi.string().max(50).required(),
  pxPhotoUrl: Joi.string().required(),
}).options({ stripUnknown: true });

const validator = (schema) => (req) => schema.validate(req);

exports.Pxphoto = Pxphoto;

exports.validate = validator(pxphotoschema);
