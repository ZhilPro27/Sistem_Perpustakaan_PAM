import express from 'express';
import {
    getAllDenda,
    getDendaById,
    updateDenda,
    searchDenda
} from '../controllers/dendaController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/denda', verifyToken, getAllDenda);
router.get('/denda/:id', verifyToken, getDendaById);
router.get('/denda/search', verifyToken, searchDenda);
router.put('/denda/update/:id', verifyToken, updateDenda);

export default router;