const Enquiry = require('../models/enquiry.model');
const generateOLPID = require('../utils/generateOLPID');
const nodemailer = require('nodemailer');
const generateInvoiceTemplate = require('../emailTemplates/invoiceTemplate');

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

    // ✅ Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // ✅ Email to Company
    const companyMailOptions = {
      from: `"OneLook Photography" <${process.env.EMAIL_FROM}>`,
      to: process.env.COMPANY_EMAIL, // e.g., onelookphotography@gmail.com
      subject: `📩 New Enquiry from ${data.Name || 'User'}`,
      html: `
        <p>Hi <strong>OneLook Photography</strong>,</p>
        <p>You received a new enquiry from the website.</p>
        <ul>
          <li><strong>Name:</strong> ${data.Name}</li>
          <li><strong>Email:</strong> ${data.Email}</li>
          <li><strong>Phone:</strong> ${data.Phone}</li>
        </ul>
        <p>OLPID: <strong>${olpid}</strong></p>
        <p>Please respond within 24 hours.</p>
      `
    };

    // ✅ Email to User
    const userMailOptions = {
      from: `"OneLook Photography" <${process.env.EMAIL_FROM}>`,
      to: data.Email,
      subject: `🎉 Thank you for contacting OneLook Photography!`,
      html: `
        <p>Hi ${data.Name || 'there'},</p>
        <p>Thank you for reaching out to OneLook Photography! Our team will get in touch with you within 24 hours.</p>
        <p>Meanwhile, feel free to check our work and updates on:</p>
        <ul>
          <li><a href="https://instagram.com/onelookphotography" target="_blank">Instagram</a></li>
          <li><a href="mailto:${process.env.COMPANY_EMAIL}">Email Us</a></li>
        </ul>
        <br>
        <p>Best regards,<br/>Team OneLook 📸</p>
      `
    };

    // ✅ Send both emails in parallel
    await Promise.all([
      transporter.sendMail(companyMailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    res.status(201).json({ message: 'Enquiry saved and emails sent', data: saved });

  } catch (error) {
    console.error('Error creating enquiry or sending emails:', error);
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
      InvoiceMeta = {},
      ...rest
    } = req.body;

    const enquiry = await Enquiry.findById(enquiryId);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    // ✅ Top-level updates
    enquiry.AssignedEmployee = AssignedEmployee;
    enquiry.CallInitiatedOn = CallInitiatedOn;
    enquiry.CallStatus = CallStatus;
    enquiry.Status = CallStatus;
    enquiry.updatedAt = new Date();

    // ✅ InvoiceMeta update logic
    if (CallStatus === 'Approved') {
      enquiry.InvoiceMeta = {
        ...(enquiry.InvoiceMeta || {}),
        ...InvoiceMeta,
        InvoiceStatus: InvoiceMeta?.InvoiceStatus || 'New'
      };
    }

    // ✅ Handle Events update
    const updatedEvents = [];
    const existingEventIds = new Set();

    for (const event of Events) {
      if (event._id && event._id !== 0) {
        const existingEvent = enquiry.Events.id(event._id);
        if (existingEvent) {
          existingEvent.EventName = event.EventName;
          existingEvent.EventDate = event.EventDate;
          existingEvent.EventLocation = event.EventLocation;
          existingEvent.EventTime = event.EventTime;
          existingEvent.EventGuests = event.EventGuests;
          existingEvent.InvoiceAmount = event.InvoiceAmount || existingEvent.InvoiceAmount;
          existingEvent.FinalApprovedAmount = event.FinalApprovedAmount || existingEvent.FinalApprovedAmount;
          existingEvent.Remarks = event.Remarks || existingEvent.Remarks;
          if (event.AssignedTeam && Array.isArray(event.AssignedTeam)) {
            existingEvent.AssignedTeam = event.AssignedTeam;
          }
          existingEventIds.add(event._id.toString());
        }
      } else {
        updatedEvents.push({
          EventName: event.EventName,
          EventDate: event.EventDate,
          EventLocation: event.EventLocation,
          EventTime: event.EventTime,
          EventGuests: event.EventGuests,
          InvoiceAmount: event.InvoiceAmount || null,
          FinalApprovedAmount: event.FinalApprovedAmount || null,
          Remarks: event.Remarks || '',
          AssignedTeam: event.AssignedTeam || [] // ✅ Include when adding new events
        });
      }
    }

    // ✅ Filter deleted events and push new ones
    enquiry.Events = enquiry.Events.filter(event =>
      existingEventIds.has(event._id.toString())
    );
    enquiry.Events.push(...updatedEvents);

    // ✅ Intelligent TeamMeta initialization when invoice is Closed
    if (InvoiceMeta?.InvoiceStatus === 'Closed') {
      enquiry.TeamMeta = {
        ...(enquiry.TeamMeta || {}),
        TeamStatus: enquiry.TeamMeta?.TeamStatus || 'New',
        AssignedBy: enquiry.TeamMeta?.AssignedBy || null,
        AssignedAt: enquiry.TeamMeta?.AssignedAt || null
      };
    }

    // ✅ Auto-close team if all events have team assigned
    const allAssigned = enquiry.Events.every(ev =>
      ev.AssignedTeam && ev.AssignedTeam.length > 0
    );

    if (allAssigned) {
      enquiry.TeamMeta = {
        ...enquiry.TeamMeta,
        TeamStatus: 'Closed',
        AssignedBy: req.user?.name || 'Admin',
        AssignedAt: new Date()
      };
    }
    const teamIsClosed = enquiry.TeamMeta?.TeamStatus === 'Closed';
    const inventoryNotAssignedYet = !enquiry.InventoryMeta?.InventoryStatus;

    if (teamIsClosed && inventoryNotAssignedYet) {
      // Ensure all team members have an assignedInventory array
      enquiry.Events.forEach(event => {
        event.AssignedTeam?.forEach(member => {
          if (!Array.isArray(member.assignedInventory)) {
            member.assignedInventory = [];
          }
        });
      });

      // 🟡 PREP STAGE: Inventory Status set to 'New' when team is Closed
      enquiry.InventoryMeta = {
        ...(enquiry.InventoryMeta || {}),
        InventoryStatus: 'New', // ⬅️ NOT final yet
        InventoryAssignedBy: req.user?.name || 'Admin',
        InventoryAssignedAt: new Date()
      };
    }
    if (req.body.InventoryMeta?.InventoryStatus === 'Closed') {
      enquiry.InventoryMeta.InventoryStatus = 'Closed';
      enquiry.InventoryMeta.InventoryAssignedBy = req.user?.name || 'Admin',
        enquiry.InventoryMeta.InventoryAssignedAt = new Date(); // optional
    }



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

exports.getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    res.status(200).json(enquiry);
  } catch (error) {
    console.error('Error fetching enquiry by ID:', error);
    res.status(500).json({ error: 'Server error fetching enquiry' });
  }
};

exports.sendInvoiceTemplate = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });

    const htmlContent = generateInvoiceTemplate(enquiry);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      from: `"OneLook Photography" <${process.env.EMAIL_FROM}>`,
      to: enquiry.Email,
      subject: 'Your Wedding Invoice Template 💌',
      html: htmlContent
    });

    res.status(200).json({ message: 'Invoice sent successfully' });

  } catch (error) {
    console.error('Error sending invoice email:', error);
    res.status(500).json({ error: 'Server error while sending email' });
  }
};