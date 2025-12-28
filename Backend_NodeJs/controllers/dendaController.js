import { dendaModel } from "../models/dendaModel.js";
import baseLogger from "../src/utils/logger.js";
const logger = baseLogger.child({ context: 'DendaController' });

export const getAllDenda = async (req, res) => {
    try {
        const dendaList = await dendaModel.getAllDenda();
        logger.info("Fetched all denda");
        res.json(dendaList);
    } catch (error) {
        logger.error(`Error fetching denda: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

export const getDendaById = async (req, res) => {
    const { id } = req.params;
    try {
        const denda = await dendaModel.getDendaById(id);
        if (!denda) {
            logger.warn(`Denda not found with ID: ${id}`);
            return res.status(404).json({ msg: "Denda not found" });
        }
        logger.info(`Fetched denda with ID: ${id}`);
        res.json(denda);
    } catch (error) {
        logger.error(`Error fetching denda by ID: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

export const updateDenda = async (req, res) => {
    const { id } = req.params;
    const dendaData = req.body;
    try {
        const existingDenda = await dendaModel.getDendaById(id);
        if (!existingDenda) {
            logger.warn(`Attempt to update non-existing denda with ID: ${id}`);
            return res.status(404).json({ msg: "Denda not found" });
        }
        const result = await dendaModel.updateDenda(id, dendaData);
        logger.info(`Denda updated with ID: ${id}`);
        res.json({ message: "Denda updated successfully" });
    } catch (error) {
        console.log(dendaData)
        logger.error(`Error updating denda: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

export const searchDenda = async (req, res) => {
    const { keyword } = req.query;
    try {
        const results = await dendaModel.searchDenda(keyword);
        logger.info(`Searched denda with keyword: ${keyword}`);
        res.json(results);
    } catch (error) {
        logger.error(`Error searching denda: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};
