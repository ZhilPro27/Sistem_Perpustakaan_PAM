import db from '../config/database.js';
import { anggotaModel } from "../models/anggotaModel.js";
import baseLogger from "../src/utils/logger.js";
const logger = baseLogger.child({ context: 'AnggotaController' });

export const getAllAnggota = async (req, res) => {
    const conn = await db.getConnection();
    logger.info("Database connection established for getAllAnggota");
    try {
        const anggotaList = await anggotaModel.getAllAnggota(conn);
        logger.info("Fetched all anggota");
        res.json(anggotaList);
    } catch (error) {
        logger.error(`Error fetching anggota: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for getAllAnggota");
    }
};

export const getAnggotaById = async (req, res) => {
    const conn = await db.getConnection();
    logger.info("Database connection established for getAnggotaById");
    const { id } = req.params;
    try {
        const anggota = await anggotaModel.getAnggotaById(conn, id);
        if (!anggota) {
            logger.warn(`Anggota not found with ID: ${id}`);
            return res.status(404).json({ msg: "Anggota not found" });
        }
        logger.info(`Fetched anggota with ID: ${id}`);
        res.json(anggota);
    } catch (error) {
        logger.error(`Error fetching anggota by ID: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for getAnggotaById");
    }
};

export const createAnggota = async (req, res) => {
    const conn = await db.getConnection();
    logger.info("Database connection established for createAnggota");
    const anggotaData = req.body;
    try {
        await conn.beginTransaction();
        const result = await anggotaModel.insertAnggota(conn, anggotaData);
        await conn.commit();
        logger.info(`New anggota created with ID: ${result.insertId}`);
        res.status(201).json({ message: "Anggota created successfully", anggotaId: result.insertId });
    } catch (error) {
        await conn.rollback();
        logger.error(`Error creating anggota: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for createAnggota");
    }
};

export const updateAnggota = async (req, res) => {
    const conn = await db.getConnection();
    logger.info("Database connection established for updateAnggota");
    const { id } = req.params;
    const anggotaData = req.body;
    try {
        await conn.beginTransaction();
        const existingAnggota = await anggotaModel.getAnggotaById(conn, id);
        if (!existingAnggota) {
            await conn.rollback();
            logger.warn(`Attempt to update non-existing anggota with ID: ${id}`);
            return res.status(404).json({ msg: "Anggota not found" });
        }
        const result = await anggotaModel.updateAnggota(conn, id, anggotaData);
        await conn.commit();
        logger.info(`Anggota updated with ID: ${id}`);
        res.json({ message: "Anggota updated successfully" });
    } catch (error) {
        await conn.rollback();
        logger.error(`Error updating anggota: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for updateAnggota");
    }
};

export const deleteAnggota = async (req, res) => {
    const conn = await db.getConnection();
    logger.info("Database connection established for deleteAnggota");
    const { id } = req.params;
    try {
        await conn.beginTransaction();
        const existingAnggota = await anggotaModel.getAnggotaById(conn, id);
        if (!existingAnggota) {
            await conn.rollback();
            logger.warn(`Attempt to delete non-existing anggota with ID: ${id}`);
            return res.status(404).json({ msg: "Anggota not found" });
        }
        const result = await anggotaModel.deleteAnggota(conn, id);
        await conn.commit();
        logger.info(`Anggota deleted with ID: ${id}`);
        res.json({ message: "Anggota deleted successfully" });
    } catch (error) {
        await conn.rollback();
        logger.error(`Error deleting anggota: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for deleteAnggota");
    }
};

export const searchAnggota = async (req, res) => {
    const conn = await db.getConnection();
    logger.info("Database connection established for searchAnggota");
    const { keyword } = req.query;
    try {
        const results = await anggotaModel.searchAnggota(conn, keyword);
        logger.info(`Search performed with keyword: ${keyword}`);
        res.json(results);
    } catch (error) {
        logger.error(`Error searching anggota: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for searchAnggota");
    }
};