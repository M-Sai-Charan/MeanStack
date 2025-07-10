const Enquiry = require('../models/enquiry.model');

const generateOLPID = async () => {
  const year = new Date().getFullYear(); // e.g., 2025
  const prefix = 'OLP' + year;

  // Find the last OLPID (sorted descending)
  const lastEntry = await Enquiry.findOne({ OLPID: { $regex: prefix } })
    .sort({ createdAt: -1 })
    .exec();

  let count = 1;

  if (lastEntry && lastEntry.OLPID) {
    const match = lastEntry.OLPID.match(/^(\d+)(OLP\d{4})$/);
    if (match && match[1]) {
      count = parseInt(match[1], 10) + 1;
    }
  }

  const padded = String(count).padStart(3, '0'); // 001, 002, etc.
  return `${padded}${prefix}`; // final OLPID like 001OLP2025
};

module.exports = generateOLPID;
