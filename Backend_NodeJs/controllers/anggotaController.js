import { anggotaModel } from "../models/anggotaModel.js";
import baseLogger from "../src/utils/logger.js";
const logger = baseLogger.child({ context: 'AnggotaController' });

export const getAllAnggota = async (req, res) => {
    try {
        const anggotaList = await anggotaModel.getAllAnggota();
        logger.info("Fetched all anggota");
        res.json(anggotaList);
    } catch (error) {
        logger.error(`Error fetching anggota: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

export const getAnggotaById = async (req, res) => {
    const { id } = req.params;
    try {
        const anggota = await anggotaModel.getAnggotaById(id);
        if (!anggota) {
            logger.warn(`Anggota not found with ID: ${id}`);
            return res.status(404).json({ msg: "Anggota not found" });
        }
        logger.info(`Fetched anggota with ID: ${id}`);
        res.json(anggota);
    } catch (error) {
        logger.error(`Error fetching anggota by ID: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

export const createAnggota = async (req, res) => {
    const anggotaData = req.body;
    try {
        const result = await anggotaModel.insertAnggota(anggotaData);
        logger.info(`New anggota created with ID: ${result.insertId}`);
        res.status(201).json({ message: "Anggota created successfully", anggotaId: result.insertId });
    } catch (error) {
        logger.error(`Error creating anggota: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

export const updateAnggota = async (req, res) => {
    const { id } = req.params;
    const anggotaData = req.body;
    try {
        const existingAnggota = await anggotaModel.getAnggotaById(id);
        if (!existingAnggota) {
            logger.warn(`Attempt to update non-existing anggota with ID: ${id}`);
            return res.status(404).json({ msg: "Anggota not found" });
        }
        const result = await anggotaModel.updateAnggota(id, anggotaData);
        logger.info(`Anggota updated with ID: ${id}`);
        res.json({ message: "Anggota updated successfully" });
    } catch (error) {
        logger.error(`Error updating anggota: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

export const deleteAnggota = async (req, res) => {
    const { id } = req.params;
    try {
        const existingAnggota = await anggotaModel.getAnggotaById(id);
        if (!existingAnggota) {
            logger.warn(`Attempt to delete non-existing anggota with ID: ${id}`);
            return res.status(404).json({ msg: "Anggota not found" });
        }
        const result = await anggotaModel.deleteAnggota(id);
        logger.info(`Anggota deleted with ID: ${id}`);
        res.json({ message: "Anggota deleted successfully" });
    } catch (error) {
        logger.error(`Error deleting anggota: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

export const searchAnggota = async (req, res) => {
    const { keyword } = req.query;
    try {
        const results = await anggotaModel.searchAnggota(keyword);
        logger.info(`Search performed with keyword: ${keyword}`);
        res.json(results);
    } catch (error) {
        logger.error(`Error searching anggota: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};