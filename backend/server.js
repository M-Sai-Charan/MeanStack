const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./db');
const ChatMessage = require('./models/chat.model'); // ✅ Import chat model

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200', // frontend
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// ✅ Connect to DB
connectDB();

// ✅ API Routes
app.use('/api/masterdata', require('./routes/masterdata.routes'));
app.use('/api/enquiry', require('./routes/enquiry.routes'));
app.use('/api/invoices', require('./routes/invoice.routes'));
app.use('/api/team', require('./routes/team.routes'));
app.use('/api/inventory', require('./routes/inventory.routes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/chat', require('./routes/chat.routes')); // ✅ chat route

// ✅ Test
app.get('/', (req, res) => {
  res.send('API is working 🚀');
});

// ✅ Socket.IO handlers
io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);

  // Join OLPID room
  socket.on('joinRoom', (olpid) => {
    socket.join(olpid);
    console.log(`🛎️ Socket ${socket.id} joined room: ${olpid}`);
  });

  // Chat messages
  socket.on('chatMessage', async (msg) => {
    console.log(`💬 [${msg.room}] ${msg.sender}: ${msg.text}`);

    // ✅ Save to MongoDB
    const savedMsg = new ChatMessage({
      room: msg.room,
      sender: msg.sender,
      text: msg.text
    });
    await savedMsg.save();

    // ✅ Broadcast to all clients in room
    io.to(msg.room).emit('chatMessage', savedMsg);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
