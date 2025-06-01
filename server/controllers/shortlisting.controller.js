import Shortlisting from '../models/shortlisting.model.js';
import { sendOfferEmail } from '../middlewares/email.middleware.js';
import User from '../models/user.model.js';

export const getShortlistedCandidates = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, search } = req.query;

        let query = { userId };

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { 'candidateDetails.name': { $regex: search, $options: 'i' } },
                { 'offerDetails.jobTitle': { $regex: search, $options: 'i' } }
            ];
        }

        const shortlisted = await Shortlisting.find(query)
            .populate('candidateId', 'candidate_name contact_information skills experience')
            .populate('chatHistoryId', 'createdAt')
            .sort({ createdAt: -1 });

        res.status(200).json(shortlisted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const sendOffer = async (req, res) => {
    try {
        const { userId } = req.params;
        const { candidate, emailTemplate, templateVariables } = req.body;

        const sessionUserId = await User.find({ supabaseId: userId }, { _id: 1 });

        const result = await sendOfferEmail(sessionUserId, candidate, emailTemplate, templateVariables);

        if (result.success) {
            res.status(200).json({
                message: 'Email sent successfully',
                offerId: result.offerId,
                shortlistingId: result.shortlistingId
            });
        } else {
            res.status(500).json({ message: result.error });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const trackEmailOpen = async (req, res) => {
    try {
        const { offerId } = req.params;

        await Shortlisting.findOneAndUpdate(
            { offerId },
            {
                $set: {
                    status: 'viewed',
                    'emailStatus.openedAt': new Date(),
                    'emailStatus.lastViewed': new Date()
                }
            }
        );

        res.set('Content-Type', 'image/png');
        res.send(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64'));
    } catch (error) {
        console.error('Error tracking email open:', error);
        res.status(500).end();
    }
};

export const getOfferDetails = async (req, res) => {
    try {
        const { offerId } = req.params;

        const offer = await Shortlisting.findOne({ offerId })
            .populate('candidateId', 'candidate_name contact_information')
            .populate('userId', 'name email');

        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        res.status(200).json(offer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update offer response
export const respondToOffer = async (req, res) => {
    try {
        const { offerId } = req.params;
        const { decision, comments } = req.body;

        const updatedOffer = await Shortlisting.findOneAndUpdate(
            { offerId },
            {
                $set: {
                    status: decision,
                    response: {
                        decision,
                        comments,
                        respondedAt: new Date()
                    }
                },
                $push: {
                    communications: {
                        type: 'email',
                        content: `Candidate ${decision} the offer`,
                        direction: 'inbound'
                    }
                }
            },
            { new: true }
        ).populate('candidateId', 'candidate_name');

        if (!updatedOffer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        res.status(200).json({
            message: `Offer ${decision} successfully`,
            candidateName: updatedOffer.candidateId.candidate_name
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};