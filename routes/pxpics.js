const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { PxPic, validatePxpic } = require("../models/pxprofpic");

router.get("/", auth, async (req, res) => {
  const pxpic = await PxPic.find();

  res.send(pxpic);
});

router.post("/", auth, async (req, res) => {
  const { error } = validatePxpic(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const profpic = new PxPic({
    pfpowner: req.body.pfpowner,
    profpicUrl: req.body.profpicUrl,
  });

  await profpic.save();

  res.send(profpic);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validatePxpic(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const profpic = await PxPic.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        pfpowner: req.body.pfpowner,
        profpicUrl: req.body.profpicUrl,
      },
    },
    { new: true }
  );

  res.send(profpic);
});

router.delete("/:id", auth, async (req, res) => {
  const profpic = await PxPic.findByIdAndRemove(req.params.id);
  if (!profpic)
    return res
      .status(404)
      .send("The patient photo w/ the given id was not found");

  res.send(profpic);
});

module.exports = router;
