require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const logger = require("./utils/logger");

const app = express();
const PORT = process.env.PORT || 3000;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts. Please try again later."
  }
});

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    logger.info("HTTP request", {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - start
    });
  });

  next();
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "API is running"
  });
});

app.use("/api/v1/user", authLimiter, userRoutes);
app.use("/api/v1/emp", employeeRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

app.use((error, req, res, next) => {
    logger.error("Application error", {
  name: error.name,
  message: error.message
});
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "Invalid JSON request body"
    });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({
      message: "Request body is too large"
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(error.errors).map((item) => ({
        field: item.path,
        message: item.message
      }))
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      message: "Invalid field value or ID"
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      message: "A record with these unique details already exists"
    });
  }

  return res.status(500).json({
    message: "Internal server error"
  });
});

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("MongoDB connection error", {
  message: error.message
});
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;