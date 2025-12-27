import { peminjamanModel } from "../models/peminjamanModel.js";
import baseLogger from "../src/utils/logger.js";
const logger = baseLogger.child({ context: 'PeminjamanController' });


export const getAllPeminjaman = async (req, res) => {
    try {
        const peminjamanList = await peminjamanModel.getAllPeminjaman();
        logger.info("Fetched all peminjaman");
        res.json(peminjamanList);
    } catch (error) {
        logger.error(`Error fetching peminjaman: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

export const getPeminjamanById = async (req, res) => {
    const { id } = req.params;
    try {
        const peminjaman = await peminjamanModel.getPeminjamanById(id);
        if (!peminjaman) {
            logger.warn(`Peminjaman not found with ID: ${id}`);
            return res.status(404).json({ msg: "Peminjaman not found" });
        }
        logger.info(`Fetched peminjaman with ID: ${id}`);
        res.json(peminjaman);
    } catch (error) {
        logger.error(`Error fetching peminjaman by ID: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

export const createPeminjaman = async (req, res) => {
    const peminjamanData = req.body;
    try {
        const result = await peminjamanModel.insertPeminjaman(peminjamanData);
        logger.info(`New peminjaman created with ID: ${result.insertId}`);
        res.status(201).json({ message: "Peminjaman created successfully", peminjamanId: result.insertId });
    } catch (error) {
        logger.error(`Error creating peminjaman: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

export const updatePeminjaman = async (req, res) => {
    const { id } = req.params;
    const peminjamanData = req.body;
    try {
        const existingPeminjaman = await peminjamanModel.getPeminjamanById(id);
        if (!existingPeminjaman) {
            logger.warn(`Attempt to update non-existing peminjaman with ID: ${id}`);
            return res.status(404).json({ msg: "Peminjaman not found" });
        }
        const result = await peminjamanModel.updatePeminjaman(id, peminjamanData);
        logger.info(`Peminjaman updated with ID: ${id}`);
        res.json({ message: "Peminjaman updated successfully" });
    } catch (error) {
        logger.error(`Error updating peminjaman: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

export const deletePeminjaman = async (req, res) => {
    const { id } = req.params;
    try {
        const existingPeminjaman = await peminjamanModel.getPeminjamanById(id);
        if (!existingPeminjaman) {
            logger.warn(`Attempt to delete non-existing peminjaman with ID: ${id}`);
            return res.status(404).json({ msg: "Peminjaman not found" });
        }
        const result = await peminjamanModel.deletePeminjaman(id);
        logger.info(`Peminjaman deleted with ID: ${id}`);
        res.json({ message: "Peminjaman deleted successfully" });
    } catch (error) {
        logger.error(`Error deleting peminjaman: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

export const searchPeminjaman = async (req, res) => {
    const { keyword } = req.query;
    try {
        const results = await peminjamanModel.searchPeminjaman(keyword);
        logger.info(`Searched peminjaman with keyword: ${keyword}`);
        res.json({
            count: results.length,
            results: results
        });
    } catch (error) {
        logger.error(`Error searching peminjaman: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

export const getPeminjamanWithDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const peminjaman = await peminjamanModel.getPeminjamanWithDetails(id);
        if (!peminjaman) {
            logger.warn(`Peminjaman with details not found for ID: ${id}`);
            return res.status(404).json({ msg: "Peminjaman not found" });
        }
        logger.info(`Fetched peminjaman with details for ID: ${id}`);
        res.json(peminjaman);
    } catch (error) {
        logger.error(`Error fetching peminjaman with details: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};