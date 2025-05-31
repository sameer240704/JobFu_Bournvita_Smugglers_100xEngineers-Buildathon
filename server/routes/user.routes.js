import express from 'express';
import { syncUser, updateProfile } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/sync-user', syncUser);
router.put('/users/:userId/profile', upload.single('avatar'), updateProfile);

export default router;