import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import logger from './src/utils/logger.js';
import httpLogger from './middleware/httplogger.js';
import anggotaRoutes from './routes/anggotaRoute.js';
import bukuRoutes from './routes/bukuRoute.js';
import peminjamanRoutes from './routes/peminjamanRoute.js';
import dendaRoutes from './routes/dendaRoute.js';
import authRoutes from './routes/authRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;


app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(httpLogger);
app.use('/uploads', express.static('uploads'));
app.use('/api', anggotaRoutes);
app.use('/api', bukuRoutes);
app.use('/api', peminjamanRoutes);
app.use('/api', dendaRoutes);
app.use('/api', authRoutes);

app.use((req, res) => {
    logger.warn(`404 Not Found - ${req.originalUrl}`);
    res.status(404).send("404 Not Found");
});

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});