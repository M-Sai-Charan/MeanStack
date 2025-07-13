const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/chat.model');

// ✅ GET chat history for a specific room (OLPID)
router.get('/history/:room', async (req, res) => {
  try {
    const messages = await ChatMessage
      .find({ room: req.params.room })
      .sort({ timestamp: 1 }); // oldest first

    res.json(messages);
  } catch (err) {
    console.error('❌ Chat History Fetch Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});
// ✅ GET all unique chat rooms with latest message per room
router.get('/rooms', async (req, res) => {
  try {
    const results = await ChatMessage.aggregate([
      { $sort: { timestamp: -1 } }, // latest first
      {
        $group: {
          _id: '$room',
          lastMessage: { $first: '$text' },
          lastSender: { $first: '$sender' },
          lastTimestamp: { $first: '$timestamp' }
        }
      },
      {
        $project: {
          room: '$_id',
          lastMessage: 1,
          lastSender: 1,
          timestamp: '$lastTimestamp',
          _id: 0
        }
      },
      { $sort: { timestamp: -1 } } // sort by latest room activity
    ]);

    res.json(results);
  } catch (err) {
    console.error('❌ Error fetching chat rooms:', err.message);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

module.exports = router;
