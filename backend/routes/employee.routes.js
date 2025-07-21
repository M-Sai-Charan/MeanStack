const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// POST /api/employees
router.post('/employees', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json({ message: 'Employee saved successfully', employee });
  } catch (error) {
    console.error('Error saving employee:', error);
    res.status(500).json({ error: 'Failed to save employee', details: error });
  }
});

// GET 
router.get('/getemployees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees', details: error });
  }
});
// PUT /api/employees/:id
router.put('/updateEmployees/:id', async (req, res) => {
  try {
    const employeeId = req.params.id;
    const updateData = req.body;

    const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, updateData, {
      new: true, // return the updated document
      runValidators: true,
    });

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee', details: error.message });
  }
});

module.exports = router;
