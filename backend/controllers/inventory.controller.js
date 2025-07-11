const Enquiry = require('../models/enquiry.model');

// ✅ GET all enquiries where InventoryStatus is 'New'
exports.getNewInventoryAssignments = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({
      'InventoryMeta.InventoryStatus': 'New'
    });

    res.status(200).json({
      message: 'Enquiries ready for inventory assignment',
      data: enquiries
    });
  } catch (error) {
    console.error('Error fetching inventory enquiries:', error);
    res.status(500).json({ error: 'Failed to fetch inventory data' });
  }
};
