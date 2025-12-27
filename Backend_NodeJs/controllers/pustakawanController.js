import { pustakawanModel } from "../models/pustakawanModel.js";
import baseLogger from "../src/utils/logger.js";
const logger = baseLogger.child({ context: 'AuthController' });
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const loginPustakawan = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        logger.warn("Login attempt with missing fields");
        return res.status(400).json({ msg: "Please enter all fields" });
    }
    try {
        pustakawanModel.getPustakawanByEmail(email).then(async (user) => {
            if (!user) {
                logger.warn(`Login attempt with invalid email: ${email}`);
                return res.status(400).json({ msg: "Invalid credentials" });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                logger.warn(`Login attempt with invalid password for email: ${email}`);
                return res.status(400).json({ msg: "Invalid credentials" });
            }
            const token = jwt.sign({ id: user.id_pustakawan }, process.env.JWT_SECRET, {
                expiresIn: 3600,
            });
            logger.info(`Pustakawan logged in: ${email}`);
            res.json({ 
                token, 
                user: {
                    id: user.id_pustakawan,
                    email: user.email
                }
            });
        });
    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

export const registerPustakawan = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        logger.warn("Registration attempt with missing fields");
        return res.status(400).json({ msg: "Please enter all fields" });
    }
    try {
        const existingUser = await pustakawanModel.getPustakawanByEmail(email);
        if (existingUser) {
            logger.warn(`Registration attempt with existing email: ${email}`);
            return res.status(400).json({ msg: "Email already registered" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newPustakawan = {
            email,
            password: hashedPassword
        };
        const result = await pustakawanModel.insertPustakawan(newPustakawan);
        logger.info(`New pustakawan registered: ${email}`);
        res.status(201).json({ message: "Pustakawan registered successfully", pustakawanId: result.insertId });
    } catch (error) {
        logger.error(`Registration error: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }
};

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