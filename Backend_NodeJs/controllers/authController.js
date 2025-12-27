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
                logger.warn(`Login attempt with invalid email: ${email} - ${req.ip}`);
                return res.status(400).json({ msg: "Invalid credentials" });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                logger.warn(`Login attempt with invalid password for email: ${email} - ${req.ip}`);
                return res.status(400).json({ msg: "Invalid credentials" });
            }
            const token = jwt.sign({ id: user.id_pustakawan }, process.env.JWT_SECRET, {
                expiresIn: `24h`,
            });
            logger.info(`Pustakawan logged in: ${email} - ${req.ip}`);
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

export const logoutPustakawan = async (req, res) => {
    try {
        const { email } = req.user;
        logger.info(`Pustakawan logged out: ${email} - ${req.ip}`);
        res.json({ message: "Logout successful" });
    } catch (error) {
        logger.error(`Logout error: ${error.message}`);
        res.status(500).json({ msg: "Server error" });
    }   
};