const express = require('express');
const cors = require('cors'); // ✅ Add this
const app = express();
const connectDB = require('./db');
app.use(cors()); // ✅ Enable CORS
app.use(express.json());

// Import and use masterdata route
const masterdataRoutes = require('./routes/masterdata.routes');
app.use('/api/masterdata', masterdataRoutes);

const enquiryRoutes = require('./routes/enquiry.routes');
app.use('/api/enquiry', enquiryRoutes);

const invoiceRoutes = require('./routes/invoice.routes');
app.use('/api/invoices', invoiceRoutes);

const teamRoutes = require('./routes/team.routes');
app.use('/api/team', teamRoutes);

const inventoryRoutes = require('./routes/inventory.routes');
app.use('/api/inventory', inventoryRoutes);

const clientRoutes = require('./routes/clientRoutes');
app.use('/api/clients', clientRoutes);

app.get('/', (req, res) => {
  res.send('API is working 🚀');
});
connectDB();
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
