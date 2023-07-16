const express = require("express");
const router = express.Router();
const _ = require("lodash");
const auth = require("../middleware/auth");
const { Treatmentrec } = require("../models/treatmentrec");
const { User } = require("../models/user");
const { Payment, validatePayment } = require("../models/payment");
const owner = require("../middleware/owner");

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.headDent) {
    let payments = await Payment.find({ dentist: user.headDent })
      .sort("date")
      .populate("handledby", "firstName lastName")
      .populate("company");

    res.send(payments);
  } else {
    const payments = await Payment.find({ dentist: req.user._id })
      .sort("date")
      .populate("handledby", "firstName lastName")
      .populate("company");

    res.send(payments);
  }
});

router.get("/:pxid", auth, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.headDent) {
    const unpaid = await Treatmentrec.find({
      dentist: user.headDent,
      paid: false,
    })
      .select("patient teeth date procedure paid handledby")
      .populate("procedure", "-_id -__v -dentist")
      .populate("patient", "fullname")
      .populate("handledby", "fullname role");
    res.send(unpaid);
  } else {
    const unpaid = await Treatmentrec.find({
      dentist: req.user._id,
      paid: false,
    })
      .select("patient teeth date procedure paid handledby")
      .populate("procedure", "-_id -__v -dentist")
      .populate("patient", "fullname")
      .populate("handledby", "fullname role");
    res.send(unpaid);
  }
});

router.post("/", [auth, owner], async (req, res) => {
  const { error } = validatePayment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const treatment = await Treatmentrec.findById(req.body.treatment)
    .populate("dentist", "firstName lastName clinicName")
    .populate("patient", "firstName lastName age sex")
    .populate("procedure", "name amount")
    .populate("handledby", "firstName lastName");

  let payment = new Payment({
    dentist: req.user._id,
    mop: req.body.mop,
    treatment: {
      _id: treatment._id,
      patient: treatment.patient._id,
      teeth: treatment.teeth,
      procedure: {
        name: treatment.procedure.name,
        amount: treatment.procedure.amount,
      },
    },
    date: req.body.date,
    handledby: req.body.handledby,
    company: req.body.company,
  });

  await payment.save();

  payment.handledby = treatment.handledby;
  res.send(payment);

  await Treatmentrec.findByIdAndUpdate(req.body.treatment, {
    $set: {
      paid: true,
    },
  });
});

router.delete("/:id", [auth, owner], async (req, res) => {
  const payment = await Payment.findByIdAndRemove(req.params.id);
  if (!payment) return res.status(404).send("payment not found");

  await Treatmentrec.findByIdAndUpdate(payment.treatment, {
    $set: {
      paid: false,
    },
  });

  res.send(payment);
});

module.exports = router;
