require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// MongoDB Connection
console.log('MongoDB URI:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully.");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'https://frontend-new-five.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions)); // Apply CORS middleware here

app.use(bodyParser.json());

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Tracking Data Schema
const trackingSchema = new mongoose.Schema({
  uniqueId: { type: String },
  url: { type: String },
  userAgent: { type: String },
  country: { type: String },
  city: { type: String },
  eventType: { type: String },
  formData: { type: Object },
  timestamp: { type: Date, default: Date.now }
});

const Tracking = mongoose.model('Tracking', trackingSchema);

// API Endpoint to Receive Tracking Data
app.post('/track', async (req, res) => {
  try {
    console.log('Received tracking data:', req.body);
    const trackingData = new Tracking(req.body);
    await trackingData.save();
    res.status(201).json({ message: 'Tracking data saved successfully.' });
  } catch (error) {
    console.error('Error saving tracking data:', error);
    res.status(500).json({ message: 'Error saving tracking data.', error: error.message });
  }
});

// Test route for CORS
app.get('/api/test', (req, res) => {
  res.json({ message: 'CORS is working' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export the app for Vercel serverless functions
module.exports = app;
