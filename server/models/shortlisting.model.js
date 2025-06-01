import mongoose from 'mongoose';

const shortlistingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
    chatHistoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatHistory',
        required: true
    },
    offerId: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'viewed', 'accepted', 'rejected', 'expired'],
        default: 'pending'
    },
    emailStatus: {
        sentAt: Date,
        openedAt: Date,
        lastViewed: Date
    },
    response: {
        decision: String,
        respondedAt: Date,
        comments: String
    },
    offerDetails: {
        jobTitle: String,
        jobDescription: String,
        salary: String,
        benefits: String,
        startDate: Date
    },
    communications: [{
        type: { type: String, enum: ['email', 'note', 'call'] },
        content: String,
        direction: { type: String, enum: ['outbound', 'inbound'] },
        timestamp: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

shortlistingSchema.index({ userId: 1 });
shortlistingSchema.index({ candidateId: 1 });
shortlistingSchema.index({ status: 1 });

const Shortlisting = mongoose.model('Shortlisting', shortlistingSchema);

export default Shortlisting;