import express from 'express';
import  {
    getAllBuku,
    createBuku,
    getBukuById,
    updateBuku,
    deleteBuku,
    searchBuku
} from '../controllers/bukuController.js';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import logger from '../src/utils/logger.js';
import { fileURLToPath } from 'url';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
    logger.info(`Membuat direktori upload di ${uploadDir}`);
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, 'buku-' + uniqueSuffix);
        logger.info(`Menyimpan file dengan nama ${'buku-' + uniqueSuffix}`);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const mimetype = allowedTypes.test(file.mimetype);
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed (jpeg, jpg, png, gif)'));
        logger.warn(`Gagal mengunggah file: Tipe file tidak diizinkan - ${file.originalname}`);
    }
});

router.get('/buku', verifyToken, getAllBuku);
router.post('/buku/create', verifyToken, upload.single('gambar'), createBuku);
router.get('/buku/search', verifyToken, searchBuku);
router.get('/buku/:id', verifyToken, getBukuById);
router.put('/buku/update/:id', verifyToken, upload.single('gambar'), updateBuku);
router.delete('/buku/delete/:id', verifyToken, deleteBuku);

export default router;