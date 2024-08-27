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
app.use(cors({
    origin: '*', // Aap specific origin define kar sakte hain, e.g., 'https://your-frontend.netlify.app'
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

// Tracking Data Schema
const trackingSchema = new mongoose.Schema({
    uniqueId: { type: String }, // Store the unique ID
    url: { type: String }, // Store the URL
    userAgent: { type: String }, // Store the user agent
    country: { type: String }, 
    city:{type:String},// Store the user's location
    eventType: { type: String }, // Store the type of event (e.g., "page_view", "contact_button_click")
    timestamp: { type: Date, default: Date.now } // Automatically store the timestamp
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
