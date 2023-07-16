const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { User, validateUser, validateEditUser } = require("../models/user");
const { Associate, validateAssoc } = require("../models/assocdent");

const auth = require("../middleware/auth");

//May need some modifications
router.get("/", auth, async (req, res) => {
  const users = await User.find().select(
    "username firstName lastName clinicName role"
  );

  res.send(users);
});

//May need some modifications
router.get("/dashboard", auth, async (req, res) => {
  let user = await User.findById(req.user._id)
    .populate("assocDent", "fullname, role, clinic")
    .populate("headDent", "fullname, role, clinic")
    .select({ password: 0 });
  if (user.role === "Associate Dentist") {
    res.send(
      _.pick(user, [
        "_id",
        "username",
        "role",
        "headDent",
        "clinicName",
        "firstName",
      ])
    );
  } else res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });
  if (user) return res.status(400).send("User already registered");

  user = new User({
    _id: new mongoose.Types.ObjectId(),
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    role: req.body.role,
    clinicName: req.body.clinicName,
    address: req.body.address,
    number: req.body.number,
    assocDent: req.body.assocDent,
    headDent: req.body.headDent,
    picUrl: req.body.picUrl,
  });

  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(user.password, salt);

  const token = user.generateAuthToken();

  const associate = new Associate({
    _id: user._id,
    dentist: user._id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  if (user.role === "Associate Dentist") {
    if (user.headDent) {
      const headDent = await User.findByIdAndUpdate(
        req.body.headDent,
        {
          $set: {
            assocDent: user._id,
          },
        },
        { new: true }
      );
      user.clinicName = headDent.clinicName;
      res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send(
          _.pick(user, [
            "_id",
            "firstName",
            "lastName",
            "role",
            "address",
            "number",
            "clinicName",
            "picUrl",
            "headDent",
          ])
        );
    } else
      res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send(
          _.pick(user, [
            "_id",
            "firstName",
            "lastName",
            "role",
            "address",
            "number",
            "picUrl",
          ])
        );
  } else if (user.role === "Head Dentist") {
    if (user.assocDent) {
      await User.findByIdAndUpdate(req.body.assocDent, {
        $set: { clinicName: req.body.clinicName, headDent: user._id },
      });
      res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send(
          _.pick(user, [
            "_id",
            "firstName",
            "lastName",
            "role",
            "clinicName",
            "address",
            "number",
            "assocDent",
            "picUrl",
          ])
        );
    } else {
      res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send(
          _.pick(user, [
            "_id",
            "firstName",
            "lastName",
            "role",
            "clinicName",
            "address",
            "number",
            "picUrl",
          ])
        );
    }
  }

  await associate.save();
  await user.save();
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateEditUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        firstName: req.body.firstName,
        lastName: `Dr. ${req.body.lastName}`,
        role: req.body.role,
        clinicName: req.body.clinicName,
        address: req.body.address,
        number: req.body.number,
        picUrl: req.body.picUrl,
      },
    },
    { new: true }
  );

  _.pick(user, [
    "_id",
    "firstName",
    "lastName",
    "role",
    "clinicName",
    "address",
    "number",
    "picUrl",
  ]);

  const associate = await Associate.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      },
    },
    { new: true }
  );
});

module.exports = router;
