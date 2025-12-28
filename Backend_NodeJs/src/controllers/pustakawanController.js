import { pustakawanModel } from "../../models/pustakawanModel.js";
import db from "../src/config/db.js";
import baseLogger from "../utils/logger.js";
const logger = baseLogger.child({ context: 'AuthController' });
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const getAllPustakawan = async (req, res) => {
    try {
        const pustakawan = await pustakawanModel.getAllPustakawan();
        logger.info("Fetched all pustakawan");
        res.json(pustakawan);
    } catch (error) {
        logger.error(`Error fetching pustakawan: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

export const getPustakawanById = async (req, res) => {
    const { id } = req.params;
    try {
        const pustakawan = await pustakawanModel.getPustakawanById(id);
        if (!pustakawan) {
            logger.warn(`Pustakawan not found with ID: ${id}`);
            return res.status(404).json({ msg: "Pustakawan not found" });
        }
        logger.info(`Fetched pustakawan with ID: ${id}`);
        res.json(pustakawan);
    } catch (error) {
        logger.error(`Error fetching pustakawan by ID: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};