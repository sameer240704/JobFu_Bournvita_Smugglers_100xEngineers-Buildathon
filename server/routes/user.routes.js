import express from 'express';
import { getCurrentUser, syncUser, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/me/:userId', getCurrentUser);
router.post('/sync-user', syncUser);
router.put('/:userId', updateProfile);

export default router;