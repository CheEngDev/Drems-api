const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  firstName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  role: {
    type: String,
    required: true,
    enum: ["Associate Dentist", "Head Dentist"],
  },
  clinicName: {
    type: String,
    minlength: 5,
    maxlength: 50,
    default: "My Clinic",
  },
  address: {
    type: String,
    minlength: 5,
    maxlength: 50,
  },
  number: {
    type: String,
    minlength: 11,
    maxlength: 11,
  },
  assocDent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  headDent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  picUrl: {
    type: String,
  },
});

userSchema.methods.generateAuthToken = function () {
  return (token = jwt.sign(
    {
      _id: this._id,
      role: this.role,
      headDent: this.headDent,
      firstName: this.firstName,
      lastName: this.lastName,
    },
    config.get("jwtPrivateKey")
  ));
};

const User = mongoose.model("User", userSchema);

const userschema = Joi.object({
  username: Joi.string().min(5).max(50).required().email(),
  password: Joi.string().min(5).max(100).required(),
  firstName: Joi.string().min(5).max(50).required(),
  lastName: Joi.string().min(5).max(50).required(),
  role: Joi.string().valid("Associate Dentist", "Head Dentist").required(),
  clinicName: Joi.string().min(5).max(50),
  address: Joi.string().min(5).max(50),
  number: Joi.string().min(11).max(11).optional(),
  assocDent: Joi.objectId(),
  headDent: Joi.objectId(),
  picUrl: Joi.string(),
}).options({ stripUnknown: true });

const usereditschema = Joi.object({
  firstName: Joi.string().min(5).max(50).required(),
  lastName: Joi.string().min(5).max(50).required(),
  role: Joi.string().valid("Associate Dentist", "Head Dentist").required(),
  clinicName: Joi.string().min(5).max(50),
  address: Joi.string().min(5).max(50),
  number: Joi.string().min(11).max(11).optional(),
  picUrl: Joi.string(),
}).options({ stripUnknown: true });

const validator = (schema) => (req) => schema.validate(req);

exports.User = User;
exports.validateUser = validator(userschema);
exports.validateEditUser = validator(usereditschema);
