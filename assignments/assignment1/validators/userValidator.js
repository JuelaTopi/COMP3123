const { body } = require("express-validator");

const signupRules = [
  body("username")
    .isString()
    .withMessage("Username must be text")
    .bail()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can contain only letters, numbers, and underscores"),

  body("email")
    .isString()
    .withMessage("Email must be text")
    .bail()
    .trim()
    .isLength({ max: 254 })
    .withMessage("Email is too long")
    .isEmail()
    .withMessage("Enter a valid email address")
    .toLowerCase(),

  body("password")
    .isString()
    .withMessage("Password must be text")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters")
    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain a number")
    .custom((value) => Buffer.byteLength(value, "utf8") <= 72)
    .withMessage("Password must not exceed 72 bytes")
];

const loginRules = [
  body("username")
    .optional()
    .isString()
    .withMessage("Username must be text")
    .bail()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters"),

  body("email")
    .optional()
    .isString()
    .withMessage("Email must be text")
    .bail()
    .trim()
    .isLength({ max: 254 })
    .withMessage("Email is too long")
    .isEmail()
    .withMessage("Enter a valid email address")
    .toLowerCase(),

  body("password")
    .isString()
    .withMessage("Password is required")
    .bail()
    .notEmpty()
    .withMessage("Password is required")
    .custom((value) => Buffer.byteLength(value, "utf8") <= 72)
    .withMessage("Password must not exceed 72 bytes"),

  body().custom((value) => {
    const hasUsername = value?.username !== undefined;
    const hasEmail = value?.email !== undefined;

    if (hasUsername === hasEmail) {
      throw new Error("Provide either a username or an email");
    }

    return true;
  })
];

module.exports = { signupRules, loginRules };