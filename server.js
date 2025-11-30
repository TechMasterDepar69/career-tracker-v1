const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job'); // Import the model

// Load config
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Allows to read JSON data
app.use(express.static('public')); // Serves the frontend

// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// --- ROUTES ---

// 1. GET all Jobs
app.get('/api/jobs', async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// 2. CREATE a new Job
app.post('/api/jobs', async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json({
            success: true,
            data: job
        });
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// 3. DELETE a Job
app.delete('/api/jobs/:id', async (req, res) => {
    try {
        // "req.paraks.id" is the ID sent in the URL
        const job = await Job.findByIdAndDelete(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// 4. UPDATE a Job (PUT request)
app.put('/api/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job not Found'
            });
        }

        res.status(200).json({
            success: true,
            data: job
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});