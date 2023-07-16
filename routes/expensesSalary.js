const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Salary, validateSalary } = require("../models/expenseSalary");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const owner = require("../middleware/owner");

router.get("/", auth, async (req, res) => {
  const salaries = await Salary.find({ clinicOwner: req.user._id }).populate(
    "dentist"
  );
  res.send(salaries);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateSalary(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const salary = new Salary({
    clinicOwner: req.user._id,
    dentist: req.body.dentist,
    salary: req.body.salary,
    date: req.body.date,
  });

  await salary.save();
  const salaries = await Salary.find({ _id: salary._id }).populate("dentist");
  res.send(salaries);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateSalary(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const salary = await Salary.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        salary: req.body.salary,
        date: req.body.date,
      },
    },
    { new: true }
  );
  res.send(salary);
});

router.delete("/:id", auth, async (req, res) => {
  const salary = await Salary.findByIdAndRemove(req.params.id);
  console.log(salary);
  if (!salary)
    return res.status(404).send("The salary w/ the given id was not found");

  res.send(salary);
});

module.exports = router;
