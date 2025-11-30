const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please add a company name'],
        trim: true //Removes whitespace from ends
    },

    position: {
        type: String,
        required: [true, 'Please add a position (e.g. Frontend Dev']
    },

    status: {
        type: String,
        // The Analyst Trick: Enum enforces strict categories
        enum: ['Applied', 'Interviewing', 'Rejected', 'Offer'],
        default: 'Applied'
    },

    salaryExpectation: { // <--- FIXED
        type: Number
    },

    dateApplied: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', JobSchema);