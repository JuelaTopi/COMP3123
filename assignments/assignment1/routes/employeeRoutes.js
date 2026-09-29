const express = require("express");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");

const {
  employeeRules,
  employeeIdRules,
  deleteEmployeeRules
} = require("../validators/employeeValidator");

const {
  getEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employeeController");

const router = express.Router();

router.use(auth);

router.get("/employees", getEmployees);

router.post(
  "/employees",
  employeeRules,
  validate,
  createEmployee
);

router.get(
  "/employees/:eid",
  employeeIdRules,
  validate,
  getEmployee
);

router.put(
  "/employees/:eid",
  employeeIdRules,
  employeeRules,
  validate,
  updateEmployee
);

router.delete(
  "/employees",
  deleteEmployeeRules,
  validate,
  deleteEmployee
);

module.exports = router;