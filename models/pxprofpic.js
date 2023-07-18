const mongoose = require("mongoose");
const Joi = require("joi");

const pxpicSchema = new mongoose.Schema({
  pfpowner: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Patient",
  },
  profpicUrl: {
    type: String,
    required: true,
  },
});

const PxPic = mongoose.model("PxPic", pxpicSchema);

const pxpicschema = Joi.object({
  pfpowner: Joi.objectId().required(),
  profpicUrl: Joi.string().required(),
});

const validator = (schema) => (req) => schema.validate(req);

exports.validatePxpic = validator(pxpicschema);
exports.PxPic = PxPic;
