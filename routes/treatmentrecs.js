const express = require("express");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");
const { Treatmentrec, validaterec } = require("../models/treatmentrec");
const auth = require("../middleware/auth");
const { User } = require("../models/user");
const owner = require("../middleware/owner");

router.get("/", auth, async (req, res) => {
  const pxrecs = await Treatmentrec.find()
    .populate("dentist", "firstName lastName clinicName")
    .populate("patient", "firstName lastName age sex")
    .populate("procedure", "name amount")
    .populate("handledby", "firstName lastName");

  res.send(pxrecs);
});

router.post("/", auth, async (req, res) => {
  const { error } = validaterec(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id);

  if (user.headDent) {
    let treatmentrec = new Treatmentrec({
      dentist: user.headDent,
      patient: req.body.patient,
      teeth: req.body.teeth,
      date: req.body.date,
      procedure: req.body.procedure,
      notes: req.body.notes,
      handledby: req.body.handledby,
    });

    await treatmentrec.save();
    res.send(treatmentrec);
  } else {
    let treatmentrec = new Treatmentrec({
      dentist: req.user._id,
      patient: req.body.patient,
      teeth: req.body.teeth,
      date: req.body.date,
      procedure: req.body.procedure,
      notes: req.body.notes,
      handledby: req.body.handledby,
    });

    await treatmentrec.save();
    const pxrecs = await Treatmentrec.find({ _id: treatmentrec._id })
      .populate("dentist", "firstName lastName clinicName")
      .populate("patient", "firstName lastName age sex")
      .populate("procedure", "name amount")
      .populate("handledby", "firstName lastName");
    res.send(pxrecs);
  }
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validaterec(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const pxrec = await Treatmentrec.findByIdAndUpdate(req.params.id, {
    $set: {
      teeth: req.body.teeth,
      date: req.body.date,
      procedure: req.body.procedure,
      notes: req.body.notes,
      handledby: req.body.handledby,
    },
  });
  res.send(pxrec);
});

router.delete("/:id", [auth, owner], async (req, res) => {
  const pxrec = await Treatmentrec.findByIdAndRemove(req.params.id);
  if (!pxrec) return res.status(404).send("Record not found");

  res.send(pxrec);
});

module.exports = router;
