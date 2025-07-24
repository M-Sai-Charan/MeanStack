const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./db');
const path = require('path');
const { Server } = require('socket.io');
const Employee = require('./models/Employee');
const onlineEmployees = new Map();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

// ✅ Middleware
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
app.use('/api/clients', require('./routes/client.routes'));
app.use('/api', require('./routes/upload.routes'));
app.use('/api/employees', require('./routes/employee.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/employees', require('./routes/employeeSettings.routes'));

app.get('/', (req, res) => {
  res.send('API is working 🚀');
});

// ✅ Serve Angular static files
app.use(express.static(path.join(__dirname, '../frontend/dist/olp/browser')));

// ✅ Fallback only for frontend (non-API) routes
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/olp/browser/index.html'));
});

// ✅ Socket.IO Logic
io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on('employee-online', async (employeeId) => {
    try {
      onlineEmployees.set(socket.id, employeeId);
      await Employee.findByIdAndUpdate(employeeId, { isOnline: true });
      console.log(`✅ Employee ${employeeId} is online`);

      // Optional: Broadcast to all clients
      socket.broadcast.emit('employee-online', employeeId);
    } catch (err) {
      console.error('❌ Error setting employee online:', err);
    }
  });

  socket.on('employee-offline', async (employeeId) => {
    try {
      await Employee.findByIdAndUpdate(employeeId, { isOnline: false });
      console.log(`🛑 Employee ${employeeId} is offline`);

      // Optional: Broadcast to all clients
      socket.broadcast.emit('employee-offline', employeeId);
    } catch (err) {
      console.error('❌ Error setting employee offline:', err);
    }
  });

  socket.on('disconnect', async () => {
    const employeeId = onlineEmployees.get(socket.id);
    if (employeeId) {
      await Employee.findByIdAndUpdate(employeeId, { isOnline: false });
      socket.broadcast.emit('employee-offline', employeeId);
      onlineEmployees.delete(socket.id);
    }
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
