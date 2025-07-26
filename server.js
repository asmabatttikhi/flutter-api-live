const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Ad = require('./models/Ad'); // ← تأكد من وجود models/Ad.js

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://asmaaalbattikhi:ZAQzaq*100@cluster0.krntcyr.mongodb.net/flutter_ads?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes

// Get all ads
app.get('/api/ads', async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to fetch ads' });
  }
});

// Create new ad
app.post('/api/ads', async (req, res) => {
  try {
    const newAd = new Ad(req.body);
    await newAd.save();
    res.status(201).json({ message: '✅ Ad created successfully' });
  } catch (error) {
    res.status(400).json({ message: '❌ Failed to create ad' });
  }
});

// Update ad
app.put('/api/ads/:id', async (req, res) => {
  try {
    const updatedAd = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAd) return res.status(404).json({ message: '❌ Ad not found' });
    res.json({ message: '✅ Ad updated successfully' });
  } catch (error) {
    res.status(400).json({ message: '❌ Failed to update ad' });
  }
});

// Delete ad
app.delete('/api/ads/:id', async (req, res) => {
  try {
    const deleted = await Ad.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: '❌ Ad not found' });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to delete ad' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
