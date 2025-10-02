// server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const mainRoutes = require('./routes');

// Kết nối tới MongoDB
connectDB();

const app = express();

// Middleware để Express hiểu được JSON
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Route chính cho server - serve HTML interface
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Sử dụng router chính với tiền tố /api
app.use('/api', mainRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});