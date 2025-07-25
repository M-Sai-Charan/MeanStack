const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  loginId: String,
  password: String,
  email: String,
  phone: String,
  address: String,
  joiningDate: Date,
  exitDate: Date,
  role: String,
  allowedRoutes: [
    {
      label: String,
      icon: String,
      route: String
    }
  ],
  teamId: String,
  aadhar: String,
  pan: String,
  bloodGroup: String,
  gender: String,
  dob: Date,
  emergencyContact: {
    name: String,
    relation: String,
    phone: String
  },
  profilePic: String,  // ✅ Cloudinary URL
  lastLogin: Date,
  sessionCount: {
    type: Number,
    default: 0
  },
  loginHistory: [
    {
      loginTime: Date,
      ipAddress: String,
      userAgent: String,
    }
  ],
  isActive: {
    type: Boolean,
    default: true
  },
 isOnline: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Employee', employeeSchema);
