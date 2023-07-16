const express = require("express");
const router = express.Router();
const { Procedure, validateProc } = require("../models/procedure");
const auth = require("../middleware/auth");
const { User } = require("../models/user");
const owner = require("../middleware/owner");

router.get("/", auth, async (req, res) => {
  let user = await User.findById(req.user._id);
  if (user.headDent) {
    const procedures = await Procedure.find({ dentist: user.headDent })
      .sort("name")
      .populate(
        "dentist",
        "-_id -password -__v -headDent -assocDent -picUrl -clinicName"
      );
    res.send(procedures);
  } else {
    const procedures = await Procedure.find({ dentist: req.user._id })
      .sort("name")
      .populate(
        "dentist",
        "-_id -password -__v -headDent -assocDent -picUrl -clinicName"
      );
    res.send(procedures);
  }
});

router.post("/", [auth, owner], async (req, res) => {
  const { error } = validateProc(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let procedure = new Procedure({
    name: req.body.name,
    amount: req.body.amount,
    dentist: req.user._id,
  });
  await procedure.save();

  res.send(procedure);
});

router.put("/:id", [auth, owner], async (req, res) => {
  const { error } = validateProc(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const procedure = await Procedure.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        amount: req.body.amount,
      },
    },
    { new: true }
  );

  res.send(procedure);
});

router.delete("/:id", [auth, owner], async (req, res) => {
  const procedure = await Procedure.findByIdAndRemove(req.params.id);
  if (!procedure)
    return res.status(404).send("The procedure w/ the given id was not found");

  res.send(procedure);
});

module.exports = router;
