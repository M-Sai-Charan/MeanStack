const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee'); // path to your model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Put this in .env in production

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({ message: 'Login ID and password are required' });
    }

    const employee = await Employee.findOne({ loginId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      {
        id: employee._id,
        role: employee.role,
        loginId: employee.loginId,
        name: employee.name,
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Track session
    const userAgent = req.headers['user-agent'];
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    employee.lastLogin = new Date();
    employee.sessionCount = (employee.sessionCount || 0) + 1;
    employee.loginHistory.push({
      loginTime: new Date(),
      ipAddress: ip,
      userAgent: userAgent,
    });

    await employee.save();

    res.json({
      message: 'Login successful',
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        loginId: employee.loginId,
        role: employee.role,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
