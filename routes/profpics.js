const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { ProfPic, validateProfpic } = require("../models/profpic");

router.get("/", auth, async (req, res) => {
  const profpic = await ProfPic.find({ pfpowner: req.user._id });

  res.send(profpic);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateProfpic(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const profpic = new ProfPic({
    pfpowner: req.body.pfpowner,
    profpicUrl: req.body.profpicUrl,
  });

  await profpic.save();

  res.send(profpic);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateProfpic(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const profpic = await ProfPic.findByIdAndUpdate(
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
  const profpic = await ProfPic.findByIdAndRemove(req.params.id);
  if (!profpic)
    return res
      .status(404)
      .send("The patient photo w/ the given id was not found");

  res.send(profpic);
});

module.exports = router;
