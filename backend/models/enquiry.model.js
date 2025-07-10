const mongoose = require('mongoose');

// Schema for each event inside an enquiry (with _id enabled)
const EventSchema = new mongoose.Schema({
  EventName: { type: String, required: true },
  EventDate: { type: String, default: '' },
  EventLocation: { type: String, default: '' },
  EventTime: { type: String, default: '' },
  EventGuests: { type: String, default: '' }
}, { _id: true }); // _id enabled for each event

// Main Enquiry Schema
const EnquirySchema = new mongoose.Schema({
  OLPID: { type: String, unique: true }, // e.g., 001OLP2025

  Bride: { type: String, required: true },
  Groom: { type: String, required: true },
  ContactNumber: { type: String, required: true },
  Email: { type: String, required: true },
  Location: { type: String, required: true },
  Comments: { type: String, default: '' },
  Source: { type: String, required: true },

  Events: [EventSchema],

  // Admin/Employee processing
  Status: { type: String, default: 'New', enum: ['New', 'Pending', 'Approved', 'Rejected'] },
  AssignedEmployee: { type: String, default: '' },
  CallInitiatedOn: { type: String, default: '' },
  CallStatus: { type: String, default: 'New' }, // pending/approved/rejected

  // Read tracking
  isRead: { type: Boolean, default: false },
  ReadBy: { type: String, default: '' },
  ReadAt: { type: Date },

  // Timestamps
}, { timestamps: true }); // includes createdAt and updatedAt

module.exports = mongoose.model('Enquiry', EnquirySchema);
