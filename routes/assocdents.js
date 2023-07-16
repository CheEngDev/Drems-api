const _ = require("lodash");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const { Associate, validateAssoc } = require("../models/assocdent");
const { User } = require("../models/user");
const owner = require("../middleware/owner");

router.get("/", auth, async (req, res) => {
  const assocDents = await Associate.find({ dentist: req.user._id });
  res.send(assocDents);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateAssoc(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const assocDent = new Associate({
    dentist: req.user._id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  await assocDent.save();

  res.send(assocDent);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateAssoc(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const assocDent = await Associate.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      },
    },
    { new: true }
  );

  res.send(assocDent);
});

router.delete("/:id", auth, async (req, res) => {
  const assocDnent = await Associate.findByIdAndRemove(req.params.id);
  if (!assocDnent)
    return res.status(404).send("The Associate w/ the given id was not found");

  res.send(assocDnent);
});

module.exports = router;
