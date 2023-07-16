module.exports = (req, res, next) => {
  if (req.user.role === "Associate Dentist") {
    if (req.user.headDent) return res.status(403).send("Access Denied");
    else {
      next();
    }
  } else {
    next();
  }
};
