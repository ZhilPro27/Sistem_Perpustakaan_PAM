import db from '../config/database.js';
import baseLogger from "../src/utils/logger.js";
const logger = baseLogger.child({ context: 'PustakawanModel' });

export const pustakawanModel = {
    getAllPustakawan: async () => {
        const sql = "SELECT id_pustakawan, email FROM pustakawan";
        try {
            const [rows] = await db.query(sql);
            logger.info("Retrieved all pustakawan from database");
            return rows;
        } catch (error) {
            logger.error(`Error retrieving all pustakawan: ${error.message}`);
            throw error;
        }
    },

    getPustakawanById: async (id) => {
        const sql = "SELECT id_pustakawan, email FROM pustakawan WHERE id_pustakawan = ?";
        try {
            const [rows] = await db.query(sql, [id]);
            logger.info(`Retrieved pustakawan with ID: ${id}`);
            return rows[0] || null;
        } catch (error) {
            logger.error(`Error retrieving pustakawan with ID ${id}: ${error.message}`);
            throw error;
        }
    },

    getPustakawanByEmail: async (email) => {
        const sql = "SELECT * FROM pustakawan WHERE email = ?";
        try {
            const [rows] = await db.query(sql, [email]);
            logger.info(`Retrieved pustakawan with email: ${email}`);
            return rows[0] || null;
        } catch (error) {
            logger.error(`Error retrieving pustakawan with email ${email}: ${error.message}`);
            throw error;
        }
    },

    insertPustakawan: async (pustakawanData) => {
        const sql = "INSERT INTO pustakawan SET ?";
        try {
            const [result] = await db.query(sql, pustakawanData);
            logger.info(`Inserted new pustakawan with ID: ${result.insertId}`);
            return result;
        } catch (error) {
            logger.error(`Error inserting new pustakawan: ${error.message}`);
            throw error;
        }
    }
};