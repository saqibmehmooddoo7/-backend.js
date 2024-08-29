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
const corsOptions = {
  origin: 'https://hatzs.com/',
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const trackingSchema = new mongoose.Schema({
  uniqueId: { type: String, required: true },
  url: { type: String, required: true },
  userAgent: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  eventType: { type: String, required: true },
  formData: { type: Object, default: {} },  
  timestamp: { type: Date, default: Date.now },
  menuButtonClick: { type: Boolean, default: false },
  closeButtonClick: { type: Boolean, default: false } 
});

const Tracking = mongoose.model('Tracking', trackingSchema);

app.post('/track', async (req, res) => {
  try {
    const trackingData = new Tracking(req.body);
    await trackingData.save();
    res.status(201).json({ message: 'Tracking data saved successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving tracking data.', error: error.message });
  }
});



app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Something went wrong!' });
});
module.exports = app;
