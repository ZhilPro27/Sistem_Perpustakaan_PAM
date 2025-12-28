import { peminjamanModel } from "../models/peminjamanModel.js";
import db from "../src/config/db.js";
import baseLogger from "../utils/logger.js";
const logger = baseLogger.child({ context: 'PeminjamanController' });


export const getAllPeminjaman = async (req, res) => {
    const conn = await db.getConnection();
    logger.info("Database connection established for getAllPeminjaman");
    try {
        const peminjamanList = await peminjamanModel.getAllPeminjaman(conn);
        logger.info("Fetched all peminjaman");
        res.json(peminjamanList);
    } catch (error) {
        logger.error(`Error fetching peminjaman: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for getAllPeminjaman");
    }
};

export const getPeminjamanById = async (req, res) => {
    const conn = await db.getConnection();
    logger.info("Database connection established for getPeminjamanById");
    const { id } = req.params;
    try {
        const peminjaman = await peminjamanModel.getPeminjamanById(conn, id);
        if (!peminjaman) {
            logger.warn(`Peminjaman not found with ID: ${id}`);
            return res.status(404).json({ msg: "Peminjaman not found" });
        }
        logger.info(`Fetched peminjaman with ID: ${id}`);
        res.json(peminjaman);
    } catch (error) {
        logger.error(`Error fetching peminjaman by ID: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for getPeminjamanById");
    }
};

export const createPeminjaman = async (req, res) => {
    const conn = await db.getConnection();
    logger.info("Database connection established for createPeminjaman");
    const peminjamanData = req.body;
    try {
        await conn.beginTransaction();
        const result = await peminjamanModel.insertPeminjaman(conn, peminjamanData);
        await conn.commit();
        logger.info(`New peminjaman created with ID: ${result.insertId}`);
        res.status(201).json({ message: "Peminjaman created successfully", peminjamanId: result.insertId });
    } catch (error) {
        await conn.rollback();
        logger.error(`Error creating peminjaman: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for createPeminjaman");
    }
};

export const updatePeminjaman = async (req, res) => {
    const conn = await db.getConnection();
    logger.info("Database connection established for updatePeminjaman");
    const { id } = req.params;
    const peminjamanData = req.body;
    try {
        await conn.beginTransaction();
        const existingPeminjaman = await peminjamanModel.getPeminjamanById(conn, id);
        if (!existingPeminjaman) {
            logger.warn(`Attempt to update non-existing peminjaman with ID: ${id}`);
            return res.status(404).json({ msg: "Peminjaman not found" });
        }
        const result = await peminjamanModel.updatePeminjaman(conn, id, peminjamanData);
        await conn.commit();
        logger.info(`Peminjaman updated with ID: ${id}`);
        res.json({ message: "Peminjaman updated successfully" });
    } catch (error) {
        await conn.rollback();
        logger.error(`Error updating peminjaman: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for updatePeminjaman");
    }
};

export const deletePeminjaman = async (req, res) => {
    const conn = await db.getConnection();
    logger.info("Database connection established for deletePeminjaman");
    const { id } = req.params;
    try {
        const existingPeminjaman = await peminjamanModel.getPeminjamanById(conn, id);
        if (!existingPeminjaman) {
            logger.warn(`Attempt to delete non-existing peminjaman with ID: ${id}`);
            return res.status(404).json({ msg: "Peminjaman not found" });
        }
        const result = await peminjamanModel.deletePeminjaman(conn, id);
        await conn.commit();
        logger.info(`Peminjaman deleted with ID: ${id}`);
        res.json({ message: "Peminjaman deleted successfully" });
    } catch (error) {
        await conn.rollback();
        logger.error(`Error deleting peminjaman: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for deletePeminjaman");
    }
};

export const searchPeminjaman = async (req, res) => {
    const conn = await db.getConnection();
    logger.info("Database connection established for searchPeminjaman");
    const { keyword } = req.query;
    try {
        const results = await peminjamanModel.searchPeminjaman(conn, keyword);
        logger.info(`Searched peminjaman with keyword: ${keyword}`);
        res.json({
            count: results.length,
            results: results
        });
    } catch (error) {
        logger.error(`Error searching peminjaman: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for searchPeminjaman");
    }
};