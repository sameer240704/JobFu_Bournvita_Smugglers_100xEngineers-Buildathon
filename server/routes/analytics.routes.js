import express from 'express';
import {
    getAnalyticsData,
    getCandidates,
    getChatHistory,
    getShortlistings
} from '../controllers/analytics.controller.js';

const router = express.Router();

router.get('/analytics', getAnalyticsData);
router.get('/candidates', getCandidates);
router.get('/chat-history', getChatHistory);
router.get('/shortlistings', getShortlistings);

export default router;