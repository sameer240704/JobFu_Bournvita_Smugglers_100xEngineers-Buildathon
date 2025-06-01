import express from 'express';
import {
    getShortlistedCandidates,
    sendOffer,
    trackEmailOpen,
    getOfferDetails,
    respondToOffer
} from '../controllers/shortlisting.controller.js';

const router = express.Router();

router.get('/user/:userId', getShortlistedCandidates);
router.post('/user/:userId/send-offer', sendOffer);
router.get('/track-email/:offerId', trackEmailOpen);
router.get('/offer/:offerId', getOfferDetails);
router.post('/offer/:offerId/respond', respondToOffer);

export default router;