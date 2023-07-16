const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Hmo, validateHmo } = require("../models/hmo");
const auth = require("../middleware/auth");
const owner = require("../middleware/owner");

router.get("/", auth, async (req, res) => {
  const hmos = await Hmo.find({ dentist: req.user._id });
  res.send(hmos);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateHmo(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let hmo = new Hmo({
    dentist: req.user._id,
    name: req.body.name,
    number: req.body.number,
  });

  await hmo.save();

  res.send(hmo);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateHmo(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const hmo = await Hmo.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        number: req.body.number,
      },
    },
    { new: true }
  );

  res.send(hmo);
});

router.delete("/:id", auth, async (req, res) => {
  const hmo = await Hmo.findByIdAndRemove(req.params.id);
  if (!hmo)
    return res.status(404).send("The patient w/ the given id was not found");

  res.send(hmo);
});

module.exports = router;
