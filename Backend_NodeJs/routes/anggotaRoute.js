import express from 'express';
import {
    getAllAnggota,
    createAnggota,
    getAnggotaById,
    updateAnggota,
    deleteAnggota,
    searchAnggota
} from '../controllers/anggotaController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/anggota', verifyToken, getAllAnggota);
router.post('/anggota/create', verifyToken, createAnggota);
router.get('/anggota/search', verifyToken, searchAnggota);
router.get('/anggota/:id', verifyToken, getAnggotaById);
router.put('/anggota/update/:id', verifyToken, updateAnggota);
router.delete('/anggota/delete/:id', verifyToken, deleteAnggota);


export default router;