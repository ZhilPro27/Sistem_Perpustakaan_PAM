import express from 'express';
import { loginPustakawan, logoutPustakawan } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', loginPustakawan);
router.post('/logout', verifyToken, logoutPustakawan);

export default router;