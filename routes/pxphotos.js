const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Patient } = require("../models/patient");
const { Pxphoto, validate } = require("../models/pxphoto");

router.get("/", auth, async (req, res) => {
  const pxphotos = await Pxphoto.find({});

  res.send(pxphotos);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const pxphoto = new Pxphoto({
    caption: req.body.caption,
    patient: req.body.patient,
    pxPhotoUrl: req.body.pxPhotoUrl,
    date: req.body.date,
  });
  await pxphoto.save();
  res.send(pxphoto);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const pxPhoto = await Pxphoto.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        caption: req.body.caption,
        pxPhotoUrl: req.body.pxPhotoUrl,
      },
    },
    { new: true }
  );

  res.send(pxPhoto);
});

router.delete("/:id", auth, async (req, res) => {
  const pxPhoto = await Pxphoto.findByIdAndRemove(req.params.id);
  if (!pxPhoto)
    return res
      .status(404)
      .send("The patient photo w/ the given id was not found");

  res.send(pxPhoto);
});

module.exports = router;
