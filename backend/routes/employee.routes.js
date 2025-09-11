const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const verifyToken = require('../middleware/authMiddleware');
const Employee = require('../models/Employee');
const { generateRandomPassword, generateLoginId } = require('../utils/employeeUtils');

// POST: Create new employee
router.post('/', async (req, res) => {
  try {
    const data = req.body;

    // Generate login ID and password
    const loginId = generateLoginId(data.name);
    const tempPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create and save employee
    const newEmployee = new Employee({
      ...data,
      loginId,
      password: hashedPassword,
    });

    const savedEmployee = await newEmployee.save();

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Load HTML template and compile with handlebars
    const templatePath = path.join(__dirname, '../templates/welcomeEmail.html');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(templateSource);

    const emailHtml = compiledTemplate({
      name: savedEmployee.name,
      loginId: savedEmployee.loginId,
      password: tempPassword,
    });

    // Send the email
    await transporter.sendMail({
      from: `"OneLook Photography" <${process.env.EMAIL_FROM}>`,
      to: savedEmployee.email,
      subject: '🎉 Welcome to OneLook Portal',
      html: emailHtml,
    });

    res.status(201).json({
      message: 'Employee created successfully',
      employee: savedEmployee,
    });

  } catch (error) {
    console.error('❌ Error creating employee:', error);
    res.status(500).json({
      error: 'Failed to create employee',
      details: error.message,
    });
  }
});

// GET: All employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error('❌ Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// PUT: Update employee
router.put('/:id', async (req, res) => {
  try {
    const employeeId = req.params.id;
    const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({
      message: 'Employee updated successfully',
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error('❌ Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee', details: error.message });
  }
});
// Protected route example
router.get('/me', verifyToken, async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id).select('-password');
    if (!employee) return res.status(404).json({ message: 'Not found' });
    res.json({ employee });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// POST: Forgot Password (Check user by email)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Employee.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Send username + id so frontend can proceed
    res.status(200).json({
      message: 'User found',
      username: user.loginId,   // or user.username if you use that
      id: user._id,
    });
  } catch (error) {
    console.error('❌ Error in forgot-password:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// POST: Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { id, newPassword } = req.body;

    const user = await Employee.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('❌ Error in reset-password:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;
