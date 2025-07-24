const express = require('express');
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// PUT /api/employees/:id/settings
router.put('/:id/settings', verifyToken, async (req, res) => {
  try {
    const { loginId, password, profilePic } = req.body;
    const updates = {};

    // ✅ Update loginId if provided
    if (loginId) {
      updates.loginId = loginId;
    }

    // ✅ Hash and update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    // ✅ Update profilePic URL if provided
    if (profilePic) {
      updates.profilePic = profilePic;
    }

    // ✅ Update employee
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({
      message: 'Employee settings updated successfully',
      employee: updatedEmployee,
    });
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ error: 'Server error while updating settings' });
  }
});

module.exports = router;
