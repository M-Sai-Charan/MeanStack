const Enquiry = require('../models/enquiry.model');
const generateOLPID = require('../utils/generateOLPID');

exports.createEnquiry = async (req, res) => {
  try {
    const olpid = await generateOLPID();
    const data = req.body;

    const newEnquiry = new Enquiry({
      ...data,
      OLPID: olpid,
      Status: 'New',
      CallStatus: 'New',
    });

    const saved = await newEnquiry.save();
    res.status(201).json({ message: 'Enquiry saved', data: saved });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.getAllEnquires = async (req, res) => {
  try {
    const enquiries = await Enquiry.find();
    res.status(200).json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ error: 'Server error fetching enquiries' });
  }
};
exports.deleteAllEnquiries = async (req, res) => {
  try {
    const result = await Enquiry.deleteMany({});
    res.status(200).json({
      message: 'All enquiries deleted successfully',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting enquiries:', error);
    res.status(500).json({ error: 'Failed to delete enquiries' });
  }
};
exports.markAsRead = async (req, res) => {
  try {
    const enquiryId = req.params.id;

    const updated = await Enquiry.findByIdAndUpdate(
      enquiryId,
      {
        isRead: true,
        ReadBy: 'Admin', // or use req.user if you implement auth
        ReadAt: new Date()
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    res.status(200).json({ message: 'Enquiry marked as read', data: updated });
  } catch (error) {
    console.error('Error marking enquiry as read:', error);
    res.status(500).json({ error: 'Server error marking enquiry as read' });
  }
};
exports.updateEnquiry = async (req, res) => {
  try {
    const enquiryId = req.params.id;
    const {
      AssignedEmployee,
      CallInitiatedOn,
      CallStatus,
      Events = [],
      ...rest
    } = req.body;

    // Fetch the current enquiry
    const enquiry = await Enquiry.findById(enquiryId);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    // Step 1: Update top-level fields
    enquiry.AssignedEmployee = AssignedEmployee;
    enquiry.CallInitiatedOn = CallInitiatedOn;
    enquiry.CallStatus = CallStatus;
    enquiry.Status = CallStatus;
    enquiry.updatedAt = new Date();

    // Step 2: Handle events
    const updatedEvents = [];
    const existingEventIds = new Set();

    for (const event of Events) {
      if (event._id && event._id !== 0) {
        // Update existing event
        const existingEvent = enquiry.Events.id(event._id);
        if (existingEvent) {
          existingEvent.EventName = event.EventName;
          existingEvent.EventDate = event.EventDate;
          existingEvent.EventLocation = event.EventLocation;
          existingEvent.EventTime = event.EventTime;
          existingEvent.EventGuests = event.EventGuests;
          existingEventIds.add(event._id.toString());
        }
      } else {
        // Add new event
        updatedEvents.push({
          EventName: event.EventName,
          EventDate: event.EventDate,
          EventLocation: event.EventLocation,
          EventTime: event.EventTime,
          EventGuests: event.EventGuests
        });
      }
    }

    // Step 3: Remove events not in updated list
    enquiry.Events = enquiry.Events.filter((event) =>
      existingEventIds.has(event._id.toString())
    );

    // Step 4: Push new events
    enquiry.Events.push(...updatedEvents);

    const saved = await enquiry.save();
    res.status(200).json({
      message: 'Enquiry updated successfully',
      data: saved
    });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    res.status(500).json({ error: 'Failed to update enquiry' });
  }
};
