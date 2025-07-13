const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  room: String,             // OLPID
  sender: String,           // 'Client' or 'Admin'
  text: String,             // message content
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
