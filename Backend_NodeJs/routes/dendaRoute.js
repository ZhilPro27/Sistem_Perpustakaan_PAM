import express from 'express';
import {
    getAllDenda,
    getDendaById,
    updateDenda,
    searchDenda,
    getDendaWithNama
} from '../controllers/dendaController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/denda', verifyToken, getAllDenda);
router.get('/denda/:id', verifyToken, getDendaById);
router.put('/denda/update/:id', verifyToken, updateDenda);
router.get('/denda/search', verifyToken, searchDenda);
router.get('/denda/nama', verifyToken, getDendaWithNama);

export default router;