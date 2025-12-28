import { dendaModel } from "../models/dendaModel.js";
import db from "../config/database.js";
import baseLogger from "../utils/logger.js";
const logger = baseLogger.child({ context: 'DendaController' });

export const getAllDenda = async (req, res) => {
    const conn = await db.getConnection();
    logger.info("Database connection established for getAllDenda");
    try {
        const dendaList = await dendaModel.getAllDenda(conn);
        logger.info("Fetched all denda");
        res.json(dendaList);
    } catch (error) {
        logger.error(`Error fetching denda: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for getAllDenda");
    }
};

export const getDendaById = async (req, res) => {
    const conn = await db.getConnection();
    logger.info("Database connection established for getDendaById");
    const { id } = req.params;
    try {
        const denda = await dendaModel.getDendaById(conn, id);
        if (!denda) {
            logger.warn(`Denda not found with ID: ${id}`);
            return res.status(404).json({ msg: "Denda not found" });
        }
        logger.info(`Fetched denda with ID: ${id}`);
        res.json(denda);
    } catch (error) {
        logger.error(`Error fetching denda by ID: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for getDendaById");
    }
};

export const updateDenda = async (req, res) => {
    const conn = await db.getConnection();
    logger.info("Database connection established for updateDenda");
    const { id } = req.params;
    const dendaData = req.body;
    try {
        await conn.beginTransaction();
        const existingDenda = await dendaModel.getDendaById(conn, id);
        if (!existingDenda) {
            logger.warn(`Attempt to update non-existing denda with ID: ${id}`);
            return res.status(404).json({ msg: "Denda not found" });
        }
        const result = await dendaModel.updateDenda(conn, id, dendaData);
        await conn.commit();
        logger.info(`Denda updated with ID: ${id}`);
        res.json({ message: "Denda updated successfully" });
    } catch (error) {
        await conn.rollback();
        logger.error(`Error updating denda: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for updateDenda");
    }
};

export const searchDenda = async (req, res) => {
    const conn = await db.getConnection();
    logger.info("Database connection established for searchDenda");
    const { keyword } = req.query;
    try {
        const results = await dendaModel.searchDenda(conn, keyword);
        logger.info(`Searched denda with keyword: ${keyword}`);
        res.json(results);
    } catch (error) {
        logger.error(`Error searching denda: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for searchDenda");
    }
};
