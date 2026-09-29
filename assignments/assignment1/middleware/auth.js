const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

async function auth(req, res, next) {
  const authorization = req.get("Authorization");
  const match = authorization?.match(/^Bearer ([^\s]+)$/i);

  if (!match) {
    return res.status(401).json({
      message: "A Bearer token is required"
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(match[1], process.env.JWT_SECRET, {
      algorithms: ["HS256"]
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired. Please log in again."
      });
    }

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        message: "Invalid token"
      });
    }

    return next(error);
  }

  if (
    !decoded ||
    typeof decoded !== "object" ||
    typeof decoded.userId !== "string" ||
    !mongoose.isObjectIdOrHexString(decoded.userId)
  ) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }

  try {
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = auth;