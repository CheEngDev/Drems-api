const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {
  OtherExpense,
  validateOtherExpense,
} = require("../models/expensesOther");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const owner = require("../middleware/owner");

router.get("/", auth, async (req, res) => {
  const otherexpenses = await OtherExpense.find({
    dentist: req.user._id,
  });
  res.send(otherexpenses);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateOtherExpense(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let otherExpense = new OtherExpense({
    dentist: req.user._id,
    description: req.body.description,
    amount: req.body.amount,
    date: req.body.date,
  });

  await otherExpense.save();
  res.send(otherExpense);
});

router.put("/:id", auth, async (req, res) => {
  const error = validateOtherExpense(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const otherexpense = await OtherExpense.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        description: req.body.description,
        amount: req.body.amount,
        date: req.body.date,
      },
    },
    { new: true }
  );
  res.send(otherexpense);
});

router.delete("/:id", auth, async (req, res) => {
  const otherexpense = await OtherExpense.findByIdAndRemove(req.params.id);
  if (!otherexpense)
    return res.status(404).send("The expense w/ the given id was not found");

  res.send(otherexpense);
});

module.exports = router;
