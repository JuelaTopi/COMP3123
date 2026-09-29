const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function signup(req, res, next) {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username or email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Username or email already exists"
      });
    }

    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { username, email, password } = req.body;

    const query = email ? { email } : { username };
    const user = await User.findOne(query).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "1h"
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { signup, login };