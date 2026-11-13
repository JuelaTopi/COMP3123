const express = require("express");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const upload = require("../middleware/upload");

const {
  employeeRules,
  employeeIdRules,
  deleteEmployeeRules,
  searchEmployeeRules
} = require("../validators/employeeValidator");

const {
  getEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees
} = require("../controllers/employeeController");

const router = express.Router();

router.use(auth);

router.get(
  "/employees/search",
  searchEmployeeRules,
  validate,
  searchEmployees
);

router.get("/employees", getEmployees);

router.post(
  "/employees",
  upload,
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
  validate,
  upload,
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