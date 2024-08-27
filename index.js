require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// MongoDB Connection using the environment variable
console.log('MongoDB URI:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected successfully.");
}).catch((err) => {
    console.error("MongoDB connection failed:", err.message);
});

const app = express();

// CORS configuration
const corsOptions = {
    origin: 'https://cerulean-lollipop-5aa6f1.netlify.app', // Replace with your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

// Tracking Data Schema
const trackingSchema = new mongoose.Schema({
    uniqueId: { type: String },
    url: { type: String },
    userAgent: { type: String },
    country: { type: String },
    city: { type: String },
    eventType: { type: String },
    timestamp: { type: Date, default: Date.now }
});

const Tracking = mongoose.model('Tracking', trackingSchema);

// API Endpoint to Receive Tracking Data
app.post('/track', async (req, res) => {
    try {
        const trackingData = new Tracking(req.body);
        await trackingData.save();
        res.status(201).send({ message: 'Tracking data saved successfully.' });
    } catch (error) {
        res.status(500).send({ message: 'Error saving tracking data.', error });
    }
});

// Start the server using the environment variable PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
