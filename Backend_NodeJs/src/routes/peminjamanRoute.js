import express from 'express';
import {
    getAllPeminjaman,
    createPeminjaman,
    getPeminjamanById,
    updatePeminjaman,
    deletePeminjaman,
    searchPeminjaman,
    updateStatusPeminjaman
} from '../controllers/peminjamanController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/peminjaman', verifyToken, getAllPeminjaman);
router.post('/peminjaman/create', verifyToken, createPeminjaman);
router.get('/peminjaman/search', verifyToken, searchPeminjaman);
router.get('/peminjaman/:id', verifyToken, getPeminjamanById);
router.put('/peminjaman/update/:id', verifyToken, updatePeminjaman);
router.delete('/peminjaman/delete/:id', verifyToken, deletePeminjaman);
router.post('/peminjaman/status/:id', verifyToken, updateStatusPeminjaman);

export default router;