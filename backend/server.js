require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/vehicles', require('./src/routes/vehicles'));
app.use('/api/orders', require('./src/routes/orders'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'phVault backend running', time: new Date() }));

// Error handler
app.use(require('./src/middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`phVault backend running on port ${PORT}`));
