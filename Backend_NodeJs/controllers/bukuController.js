import { bukuModel } from "../models/bukuModel.js";
import baseLogger from "../src/utils/logger.js";
const logger = baseLogger.child({ context: 'BukuController' });

export const getAllBuku = async (req, res) => {
    try {
        const bukuList = await bukuModel.getAllBuku();
        logger.info("Fetched all buku");
        res.json(bukuList);
    } catch (error) {
        logger.error(`Error fetching buku: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

export const getBukuById = async (req, res) => {
    const { id } = req.params;
    try {
        const buku = await bukuModel.getBukuById(id);
        if (!buku) {
            logger.warn(`Buku not found with ID: ${id}`);
            return res.status(404).json({ msg: "Buku not found" });
        }
        logger.info(`Fetched buku with ID: ${id}`);
        res.json(buku);
    } catch (error) {
        logger.error(`Error fetching buku by ID: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

export const createBuku = async (req, res) => {
    const bukuData = req.body;

    if (req.file) {
        bukuData.gambar = req.file.filename;
        logger.info(`Uploading gambar for new buku: ${req.file.filename}`);
    }

    try {
        const result = await bukuModel.insertBuku(bukuData);
        logger.info(`New buku created with ID: ${result.insertId}`);
        res.status(201).json({ message: "Buku created successfully", bukuId: result.insertId });
    } catch (error) {
        logger.error(`Error creating buku: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

export const updateBuku = async (req, res) => {
    const { id } = req.params;
    const bukuData = req.body;

    if (req.file) {
        bukuData.gambar = req.file.filename;
        logger.info(`Uploading gambar for buku update: ${req.file.filename}`);
    }

    try {
        const existingBuku = await bukuModel.getBukuById(id);
        if (!existingBuku) {
            logger.warn(`Attempt to update non-existing buku with ID: ${id}`);
            return res.status(404).json({ msg: "Buku not found" });
        }
        const result = await bukuModel.updateBuku(id, bukuData);
        logger.info(`Buku updated with ID: ${id}`);
        res.json({ message: "Buku updated successfully" });
    } catch (error) {
        logger.error(`Error updating buku: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

export const deleteBuku = async (req, res) => {
    const { id } = req.params;
    try {
        const existingBuku = await bukuModel.getBukuById(id);
        if (!existingBuku) {
            logger.warn(`Attempt to delete non-existing buku with ID: ${id}`);
            return res.status(404).json({ msg: "Buku not found" });
        }
        const result = await bukuModel.deleteBuku(id);
        logger.info(`Buku deleted with ID: ${id}`);
        res.json({ message: "Buku deleted successfully" });
    } catch (error) {
        logger.error(`Error deleting buku: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

export const searchBuku = async (req, res) => {
    const { keyword } = req.query;
    try {
        const results = await bukuModel.searchBuku(keyword);
        logger.info(`Searched buku with keyword: ${keyword}`);
        res.json(results);
    } catch (error) {
        logger.error(`Error searching buku: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};