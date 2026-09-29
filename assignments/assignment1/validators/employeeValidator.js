const { body, param, query } = require("express-validator");

function textField(name) {
  return body(name)
    .isString()
    .withMessage(`${name} must be text`)
    .bail()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(`${name} must contain 1 to 100 characters`);
}

const employeeRules = [
  body().custom((value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Request body must be a JSON object");
    }

    const allowedFields = [
      "first_name",
      "last_name",
      "email",
      "position",
      "salary",
      "date_of_joining",
      "department"
    ];

    if (Object.keys(value).some((key) => !allowedFields.includes(key))) {
      throw new Error("Request contains an unexpected field");
    }

    return true;
  }),

  textField("first_name"),
  textField("last_name"),
  textField("position"),
  textField("department"),

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

  body("salary").custom((value) => {
    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value <= 0
    ) {
      throw new Error("Salary must be a positive number");
    }

    return true;
  }),

  body("date_of_joining")
    .isString()
    .withMessage("Date of joining is required")
    .bail()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Use YYYY-MM-DD for date of joining")
    .bail()
    .isISO8601({ strict: true })
    .withMessage("Enter a valid date")
];

const employeeIdRules = [
  param("eid")
    .isMongoId()
    .withMessage("Employee ID must be a valid MongoDB ObjectId")
];

const deleteEmployeeRules = [
  query("eid")
    .isMongoId()
    .withMessage("Employee ID must be a valid MongoDB ObjectId")
];

module.exports = {
  employeeRules,
  employeeIdRules,
  deleteEmployeeRules
};