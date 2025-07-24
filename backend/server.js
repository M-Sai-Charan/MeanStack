const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./db');
const path = require('path');
const app = express();
const server = http.createServer(app);

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
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API is working 🚀');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

 // ✅ Serve Angular static files
app.use(express.static(path.join(__dirname, '../frontend/dist/olp/browser')));

// ✅ Fallback only for frontend (non-API) routes
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/olp/browser/index.html'));
});
