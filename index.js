const express = require("express");
const app = express();
require("express-async-errors");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const winston = require("winston");
const config = require("config");

// if (!config.get("jwtPrivateKey")) {
//   console.log("FATAL ERROR:jwtPrivateKey is not set");
//   process.exit(1);
// }

require("./start/logging")();
require("./start/routes")(app);
require("./start/db")();
require("./start/config")();

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
