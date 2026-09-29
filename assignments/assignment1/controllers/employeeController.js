const Employee = require("../models/Employee");

function employeeData(body) {
  return {
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    position: body.position,
    salary: body.salary,
    date_of_joining: body.date_of_joining,
    department: body.department
  };
}

async function findOwnedEmployee(id, userId, res) {
  const employee = await Employee.findById(id);

  if (!employee) {
    res.status(404).json({
      message: "Employee not found"
    });
    return null;
  }

  if (employee.user.toString() !== userId.toString()) {
    res.status(403).json({
      message: "You cannot access another user's employee"
    });
    return null;
  }

  return employee;
}

async function getEmployees(req, res, next) {
  try {
    const employees = await Employee.find({
      user: req.user._id
    });

    return res.status(200).json({ employees });
  } catch (error) {
    next(error);
  }
}

async function createEmployee(req, res, next) {
  try {
    const employee = await Employee.create({
      ...employeeData(req.body),
      user: req.user._id
    });

    return res.status(201).json({
      message: "Employee created successfully",
      employee
    });
  } catch (error) {
    next(error);
  }
}

async function getEmployee(req, res, next) {
  try {
    const employee = await findOwnedEmployee(
      req.params.eid,
      req.user._id,
      res
    );

    if (!employee) return;

    return res.status(200).json({ employee });
  } catch (error) {
    next(error);
  }
}

async function updateEmployee(req, res, next) {
  try {
    const employee = await findOwnedEmployee(
      req.params.eid,
      req.user._id,
      res
    );

    if (!employee) return;

    Object.assign(employee, employeeData(req.body));
    await employee.save();

    return res.status(200).json({
      message: "Employee updated successfully",
      employee
    });
  } catch (error) {
    next(error);
  }
}

async function deleteEmployee(req, res, next) {
  try {
    const employee = await findOwnedEmployee(
      req.query.eid,
      req.user._id,
      res
    );

    if (!employee) return;

    await Employee.deleteOne({
      _id: employee._id,
      user: req.user._id
    });

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee
};