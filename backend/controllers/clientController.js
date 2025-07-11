const Enquiry = require('../models/enquiry.model');


// GET all fully approved client enquiries
exports.getFinalApprovedClients = async (req, res) => {
  try {
    const clients = await Enquiry.find({
      CallStatus: 'Approved',
      'InvoiceMeta.InvoiceStatus': 'Closed',
      'TeamMeta.TeamStatus': 'Closed',
      'InventoryMeta.InventoryStatus': 'Closed'
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Final approved clients fetched successfully',
      data: clients
    });
  } catch (error) {
    console.error('[ClientController] Error fetching final approved clients:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
};
