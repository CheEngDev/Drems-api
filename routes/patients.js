const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Patient, validatePx } = require("../models/patient");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const owner = require("../middleware/owner");

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.headDent) {
    const patients = await Patient.find({ dentist: user.headDent })
      .populate("dentist", "-_id -password -__v -assocDent")
      .sort("name");
    res.send(patients);
  } else {
    const patients = await Patient.find({ dentist: req.user._id })
      .populate("dentist", "-_id -password -__v -headDent")
      .sort("name");
    res.send(patients);
  }
});

router.get("/:id", auth, async (req, res) => {
  const patient = await Patient.findById(req.params.id).populate(
    "dentist",
    "-_id -password -__v -headDent -assocDent"
  );

  res.send(patient);
});

router.post("/", auth, async (req, res) => {
  const { error } = validatePx(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id);

  if (user.headDent) {
    let patient = new Patient({
      dentist: user.headDent,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      sex: req.body.sex,
      email: req.body.email,
      number: req.body.number,
      pxPicUrl: req.body.pxPicUrl,
    });

    await patient.save();

    res.send(patient);
  } else {
    let patient = new Patient({
      dentist: req.user._id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      sex: req.body.sex,
      email: req.body.email,
      number: req.body.number,
      pxPicUrl: req.body.pxPicUrl,
    });

    await patient.save();

    res.send(patient);
  }
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validatePx(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const patient = await Patient.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        fullname: req.body.fullname,
        age: req.body.age,
        sex: req.body.sex,
        email: req.body.email,
        number: req.body.numbers,
        pxPicUrl: req.body.pxPicurl,
      },
    },
    { new: true }
  );

  res.send(patient);
});

router.delete("/:id", [auth, owner], async (req, res) => {
  const patient = await Patient.findByIdAndRemove(req.params.id);
  if (!patient)
    return res.status(404).send("The patient w/ the given id was not found");

  res.send(patient);
});

module.exports = router;
