import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    position: { type: String, required: true },
    skills: [{ type: String }],
    experience: { type: String },
    location: { type: String },
    status: {
        type: String,
        enum: ['pending', 'contacted', 'accepted', 'rejected'],
        default: 'pending',
    },
    lastContacted: { type: Date, default: Date.now },
    offerDetails: {
        jobTitle: String,
        salary: String,
        benefits: [String],
        startDate: Date,
        offerId: String,
    },
    responses: [
        {
            date: { type: Date, default: Date.now },
            response: { type: String, enum: ['accepted', 'rejected', 'pending'] },
            notes: String,
        },
    ],
});

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;