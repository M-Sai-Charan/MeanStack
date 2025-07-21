const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
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
  profilePic: String  // ✅ Cloudinary URL
});

module.exports = mongoose.model('Employee', employeeSchema);
