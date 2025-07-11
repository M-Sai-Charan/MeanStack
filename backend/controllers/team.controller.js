const Enquiry = require('../models/enquiry.model');

exports.getAllNewTeamAssignments = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({
      'TeamMeta.TeamStatus': 'New'
    });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      message: 'Fetched all enquiries with TeamStatus = New',
      data: enquiries
    });
  } catch (error) {
    console.error('Error fetching team assignments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching team assignments'
    });
  }
};
