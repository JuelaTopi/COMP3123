const Employee = require("../models/Employee");
const {
  saveProfilePicture,
  removeProfilePicture
} = require("../utils/profilePictures");

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
  let newPicture = "";

  try {
    if (req.file) {
      newPicture = await saveProfilePicture(req.file);
    }

    const employee = await Employee.create({
      ...employeeData(req.body),
      user: req.user._id,
      profile_picture: newPicture
    });

    newPicture = "";

    return res.status(201).json({
      message: "Employee created successfully",
      employee
    });
  } catch (error) {
    await removeProfilePicture(newPicture);
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
  let newPicture = "";

  try {
    const existingEmployee = await findOwnedEmployee(
      req.params.eid,
      req.user._id,
      res
    );

    if (!existingEmployee) return;

    const changes = employeeData(req.body);

    if (req.file) {
      newPicture = await saveProfilePicture(req.file);
      changes.profile_picture = newPicture;
    }

    const employee = await Employee.findOneAndUpdate(
      {
        _id: existingEmployee._id,
        user: req.user._id,
        __v: existingEmployee.__v
      },
      {
        $set: changes,
        $inc: { __v: 1 }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!employee) {
      await removeProfilePicture(newPicture);

      return res.status(409).json({
        message: "Employee changed during this update. Refresh and try again."
      });
    }

    newPicture = "";

    if (req.file) {
      await removeProfilePicture(existingEmployee.profile_picture);
    }

    return res.status(200).json({
      message: "Employee updated successfully",
      employee
    });
  } catch (error) {
    await removeProfilePicture(newPicture);
    next(error);
  }
}

async function deleteEmployee(req, res, next) {
  try {
    const existingEmployee = await findOwnedEmployee(
      req.query.eid,
      req.user._id,
      res
    );

    if (!existingEmployee) return;

    const employee = await Employee.findOneAndDelete({
      _id: existingEmployee._id,
      user: req.user._id
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    await removeProfilePicture(employee.profile_picture);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function searchEmployees(req, res, next) {
  try {
    const filter = { user: req.user._id };

    for (const field of ["department", "position"]) {
      if (req.query[field] !== undefined) {
        const searchText = req.query[field].trim();
        const escapedText = searchText.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );

        filter[field] = {
          $regex: escapedText,
          $options: "i"
        };
      }
    }

    const employees = await Employee.find(filter);

    return res.status(200).json({ employees });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees
};