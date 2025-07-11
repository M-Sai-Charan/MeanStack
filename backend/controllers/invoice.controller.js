const Enquiry = require('../models/enquiry.model');

// GET /api/invoices — All enquiries with CallStatus: Approved & InvoiceStatus: New
exports.getAllInvoices = async (req, res) => {
  try {
    const approvedInvoices = await Enquiry.find({
      CallStatus: 'Approved',
      'InvoiceMeta.InvoiceStatus': { $in: ['New', 'In-progress', 'Closed', 'Pending'] }
    });

    res.status(200).json({
      success: true,
      count: approvedInvoices.length,
      message: 'Fetched all invoices with status New and callStatus Approved',
      data: approvedInvoices
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching invoices'
    });
  }
};
