const mongoose = require("mongoose");
const Joi = require("joi");

const profpicSchema = new mongoose.Schema({
  pfpowner: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  profpicUrl: {
    type: String,
    required: true,
  },
});

const ProfPic = mongoose.model("Profile", profpicSchema);

const profpicschema = Joi.object({
  pfpowner: Joi.objectId().required(),
  profpicUrl: Joi.string().required(),
}).options({ stripUnknown: true });

const validator = (schema) => (req) => schema.validate(req);

exports.validateProfpic = validator(profpicschema);
exports.ProfPic = ProfPic;
