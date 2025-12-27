import express from 'express';
import {
    loginPustakawan,
    registerPustakawan
} from '../controllers/pustakawanController.js';

const router = express.Router();

router.post('/pustakawan/register', registerPustakawan);
router.post('/pustakawan/login', loginPustakawan);

export default router;