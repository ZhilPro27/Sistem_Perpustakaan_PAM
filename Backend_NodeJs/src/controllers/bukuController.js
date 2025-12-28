import { bukuModel } from "../models/bukuModel.js";
import db from "../src/config/db.js";
import baseLogger from "../utils/logger.js";
import fs from "fs";
const logger = baseLogger.child({ context: 'BukuController' });

export const getAllBuku = async (req, res) => {
    const conn = await db.getConnection();
    logger.info("Database connection established for getAllBuku");
    try {
        const bukuList = await bukuModel.getAllBuku(conn);
        logger.info("Fetched all buku");
        res.json(bukuList);
    } catch (error) {
        logger.error(`Error fetching buku: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for getAllBuku");
    }
};

export const getBukuById = async (req, res) => {
    const { id } = req.params;
    const conn = await db.getConnection();
    logger.info("Database connection established for getBukuById");
    try {
        const buku = await bukuModel.getBukuById(conn, id);
        if (!buku) {
            logger.warn(`Buku not found with ID: ${id}`);
            return res.status(404).json({ msg: "Buku not found" });
        }
        logger.info(`Fetched buku with ID: ${id}`);
        res.json(buku);
    } catch (error) {
        logger.error(`Error fetching buku by ID: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for getBukuById");
    }
};

export const createBuku = async (req, res) => {
    const bukuData = req.body;
    const conn = await db.getConnection();
    logger.info("Database connection established for createBuku");

    try {
        await conn.beginTransaction();
        if (req.file) {
        bukuData.gambar = req.file.filename;
        logger.info(`Uploading gambar for new buku: ${req.file.filename}`);
        }
        const result = await bukuModel.insertBuku(conn, bukuData);
        await conn.commit();
        logger.info(`New buku created with ID: ${result.insertId}`);
        res.status(201).json({ message: "Buku created successfully", bukuId: result.insertId });
    } catch (error) {
        await conn.rollback();
        logger.error(`Error creating buku: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for createBuku");
    }
};

export const updateBuku = async (req, res) => {
    const { id } = req.params;
    const bukuData = req.body;
    const conn = await db.getConnection();
    logger.info("Database connection established for updateBuku");

    try {
        await conn.beginTransaction();
        const existingBuku = await bukuModel.getBukuById(conn, id);
        if (!existingBuku) {
            logger.warn(`Attempt to update non-existing buku with ID: ${id}`);
            return res.status(404).json({ msg: "Buku not found" });
        }
        if (existingBuku.gambar && req.file) {
            const oldImagePath = `./uploads/${existingBuku.gambar}`;
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    logger.error(`Error deleting old gambar: ${err.message}`);
                }
            });
        }
        if (req.file) {
        bukuData.gambar = req.file.filename;
        logger.info(`Uploading gambar for buku update: ${req.file.filename}`);
        }
        const result = await bukuModel.updateBuku(conn, id, bukuData);
        await conn.commit();
        logger.info(`Buku updated with ID: ${id}`);
        res.json({ message: "Buku updated successfully" });
    } catch (error) {
        await conn.rollback();
        logger.error(`Error updating buku: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for updateBuku");
    }
};

export const deleteBuku = async (req, res) => {
    const { id } = req.params;
    const conn = await db.getConnection();
    logger.info("Database connection established for deleteBuku");
    try {
        await conn.beginTransaction();
        const existingBuku = await bukuModel.getBukuById(conn, id);
        if (!existingBuku) {
            logger.warn(`Attempt to delete non-existing buku with ID: ${id}`);
            return res.status(404).json({ msg: "Buku not found" });
        }
        if (existingBuku.gambar) {
            const imagePath = `./uploads/${existingBuku.gambar}`;
            fs.unlink(imagePath, (err) => {
                if (err) {
                    logger.error(`Error deleting gambar: ${err.message}`);
                }
            });
        }
        const result = await bukuModel.deleteBuku(conn, id);
        await conn.commit();
        logger.info(`Buku deleted with ID: ${id}`);
        res.json({ message: "Buku deleted successfully" });
    } catch (error) {
        await conn.rollback();
        logger.error(`Error deleting buku: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for deleteBuku");
    }
};

export const searchBuku = async (req, res) => {
    const { keyword } = req.query;
    const conn = await db.getConnection();
    logger.info("Database connection established for searchBuku");
    try {
        const results = await bukuModel.searchBuku(conn, keyword);
        logger.info(`Searched buku with keyword: ${keyword}`);
        res.json(results);
    } catch (error) {
        logger.error(`Error searching buku: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    } finally {
        conn.release();
        logger.info("Database connection released for searchBuku");
    }
};