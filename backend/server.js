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

app.get('/', (req, res) => {
  res.send('API is working 🚀');
});
connectDB();
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
