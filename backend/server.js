const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./db');

const app = express();
const server = http.createServer(app);

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
// ✅ Test
app.get('/', (req, res) => {
  res.send('API is working 🚀');
});



const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
