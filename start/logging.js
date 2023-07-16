const winston = require("winston");

module.exports = function () {
  process.on("uncaughtException", (ex) => {
    winston.error(ex.message, ex);
    function processexit() {
      process.exit(1);
    }

    setTimeout(processexit, 1000);
  });

  process.on("unhandledRejection", (ex) => {
    winston.error(ex.message, ex);
    function processexit() {
      process.exit(1);
    }

    setTimeout(processexit, 1000);
  });

  winston.add(new winston.transports.File({ filename: "logfile.log" }));

  winston.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
};
