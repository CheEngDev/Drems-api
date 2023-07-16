const _ = require("lodash");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const { Appointment, validateAppointment } = require("../models/appointment");
const Patient = require("../models/patient");
const { User } = require("../models/user");
const owner = require("../middleware/owner");

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.role === "Associate Dentist") {
    const appointments = await Appointment.find({ dentistOD: req.user._id })
      .populate("patient")
      .populate("dentistOD", "firstName lastName")
      .populate("procedure");

    res.send(appointments);
  } else {
    const appointments = await Appointment.find({ dentist: req.user._id })
      .populate("patient")
      .populate("dentistOD", "firstName lastName")
      .populate("procedure");

    res.send(appointments);
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validateAppointment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id);

  if (user.headDent) {
    const appointment = new Appointment({
      dentist: user.headDent,
      patient: req.body.patient,
      procedure: req.body.procedure,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      dentistOD: req.body.dentistOD,
      remarks: req.body.remarks,
    });

    await appointment.save();

    const result = await Appointment.find({ _id: appointment._id })
      .populate("patient", "firstName lastName")
      .populate("dentistOD", "firstName lastName")
      .populate("procedure");

    res.send(result);
  } else {
    const appointment = new Appointment({
      dentist: req.user._id,
      patient: req.body.patient,
      procedure: req.body.procedure,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      dentistOD: req.body.dentistOD,
      remarks: req.body.remarks,
    });

    await appointment.save();
    const result = await Appointment.find({ _id: appointment._id })
      .populate("patient", "firstName lastName")
      .populate("dentistOD", "firstName lastName")
      .populate("procedure");

    res.send(result);
  }
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateAppointment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        patient: req.body.patient,
        procedure: req.body.procedure,
        date: req.body.date,
        startTime: req.body.startTime,
        dentistOD: req.body.dentistOD,
        remarks: req.body.remarks,
      },
    },
    { new: true }
  );

  console.log(appointment);
  res.send(appointment);
});

router.patch("/:id", auth, async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        completed: req.body.completed,
      },
    },
    { new: true }
  );

  res.send(appointment);
});

router.delete("/:id", [auth, owner], async (req, res) => {
  const appointment = await Appointment.findByIdAndRemove(req.params.id);
  if (!appointment)
    return res
      .status(404)
      .send("The appointment w/ the given id was not found");

  res.send(appointment);
});

module.exports = router;
