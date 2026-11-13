const winston = require("winston");
const path = require("path");
const fs = require("fs");

const transports = [
  new winston.transports.Console()
];

// Save log files locally, but not on Vercel
if (!process.env.VERCEL) {
  const logDir = path.join(__dirname, "../logs");

  fs.mkdirSync(logDir, { recursive: true });

  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error"
    }),
    new winston.transports.File({
      filename: path.join(logDir, "app.log")
    })
  );
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports
});

module.exports = logger;