const express = require("express");
const { signup, login } = require("../controllers/userController");
const {
  signupRules,
  loginRules
} = require("../validators/userValidator");
const validate = require("../middleware/validate");

const router = express.Router();

router.post("/signup", signupRules, validate, signup);
router.post("/login", loginRules, validate, login);

module.exports = router;