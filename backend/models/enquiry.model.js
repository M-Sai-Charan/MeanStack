const mongoose = require('mongoose');

// Schema for each event inside an enquiry (with _id enabled)
const EventSchema = new mongoose.Schema({
  EventName: { type: String, required: true },
  EventDate: { type: String, default: '' },
  EventLocation: { type: String, default: '' },
  EventTime: { type: String, default: '' },
  EventGuests: { type: String, default: '' },

  // 💸 Invoice-related fields
  InvoiceAmount: { type: Number, default: null },           // Added by employee
  FinalApprovedAmount: { type: Number, default: null },     // Approved by admin
  Remarks: { type: String, default: '' },
   AssignedTeam: [
    {
      name: { type: String, required: true },
      role: { type: String, required: true },
      assignedInventory: [{ type: String }] 
    }
  ]                    // Optional notes
}, { _id: true }); // _id enabled for each event

// Main Enquiry Schema
const EnquirySchema = new mongoose.Schema({
  OLPID: { type: String, unique: true, required: true }, // e.g., 001OLP2025

  // Client details
  Bride: { type: String, required: true },
  Groom: { type: String, required: true },
  ContactNumber: { type: String, required: true },
  Email: { type: String, required: true },
  Location: { type: String, required: true },
  Comments: { type: String, default: '' },
  Source: { type: String, required: true },

  // Events array
  Events: [EventSchema],

  // Enquiry processing fields
  Status: { type: String, default: 'New', enum: ['New', 'Pending', 'Approved', 'Rejected'] },
  AssignedEmployee: { type: String, default: '' },
  CallInitiatedOn: { type: String, default: '' },
  CallStatus: { type: String, default: 'New' }, // New, Pending, Approved, Rejected

  // Admin read tracking
  isRead: { type: Boolean, default: false },
  ReadBy: { type: String, default: '' },
  ReadAt: { type: Date },

  // 🔽 Invoice metadata block
  InvoiceMeta: {
    InvoiceStatus: {
      type: String,
      enum: ['New', 'Closed', 'In-progress', 'Pending'],
      default: 'New'
    },
    InvoiceCreatedBy: { type: String, default: null },
    InvoiceCreatedAt: { type: Date, default: null },
    InvoiceApprovedBy: { type: String, default: null },
    InvoiceApprovedAt: { type: Date, default: null },
    TotalEstimatedAmount: { type: Number, default: null },
    TotalApprovedAmount: { type: Number, default: null },
    ClientViewLink: { type: String, default: null },
    ClientViewExpiry: { type: Date, default: null }
  },
  TeamMeta: {
    AssignedBy: { type: String, default: null }, // Admin/Employee name
    AssignedAt: { type: Date, default: null },
     TeamStatus: {
      type: String,
      enum: ['New', 'Closed'],
    },
  },
  InventoryMeta: {
  InventoryStatus: {
    type: String,
    enum: ['New', 'Closed'],
    default: null
  },
  InventoryAssignedBy: { type: String, default: null },
  InventoryAssignedAt: { type: Date, default: null }
}


}, { timestamps: true }); // includes createdAt and updatedAt

// Export the model
module.exports = mongoose.model('Enquiry', EnquirySchema);
