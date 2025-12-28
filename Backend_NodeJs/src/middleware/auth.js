import jwt from 'jsonwebtoken';
import baseLogger from '../utils/logger.js';
const logger = baseLogger.child({ context: 'AuthMiddleware' });
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        logger.warn(`Access denied. No token provided from IP: ${req.ip}`);
        return res.status(401).json({ msg: "Akses ditolak. Token tidak ditemukan." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        logger.error(`Token verification failed: ${error.message}`);
        return res.status(403).json({ msg: "Token tidak valid atau sudah kadaluarsa." });
    }
};