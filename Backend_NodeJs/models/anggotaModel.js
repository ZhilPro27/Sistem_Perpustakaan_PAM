import db from '../config/database.js';
import baseLogger from "../src/utils/logger.js";
const logger = baseLogger.child({ context: 'AnggotaModel' });

export const anggotaModel = {
    getAllAnggota: async () => {
        const sql = "SELECT * FROM anggota";
        try {
            const [rows] = await db.query(sql);
            logger.info("Retrieved all anggota from database");
            return rows;
        } catch (error) {
            logger.error(`Error retrieving all anggota: ${error.message}`);
            throw error;
        }
    },

    getAnggotaById: async (id) => {
        const sql = "SELECT * FROM anggota WHERE id_anggota = ?";
        try {
            const [rows] = await db.query(sql, [id]);
            logger.info(`Retrieved anggota with ID: ${id}`);
            return rows[0] || null;
        } catch (error) {
            logger.error(`Error retrieving anggota with ID ${id}: ${error.message}`);
            throw error;
        }
    },

    insertAnggota: async (anggotaData) => {
        const sql = "INSERT INTO anggota SET ?";
        try {
            const [result] = await db.query(sql, anggotaData);
            logger.info(`Inserted new anggota with ID: ${result.insertId}`);
            return result;
        } catch (error) {
            logger.error(`Error inserting new anggota: ${error.message}`);
            throw error;
        }
    },

    updateAnggota: async (id, anggotaData) => {
        const sql = "UPDATE anggota SET ? WHERE id_anggota = ?";
        try {
            const [result] = await db.query(sql, [anggotaData, id]);
            logger.info(`Updated anggota with ID: ${id}`);
            return result;
        } catch (error) {
            logger.error(`Error updating anggota with ID ${id}: ${error.message}`);
            throw error;
        }
    },

    deleteAnggota: async (id) => {
        const sql = "DELETE FROM anggota WHERE id_anggota = ?";
        try {
            const [result] = await db.query(sql, [id]);
            logger.info(`Deleted anggota with ID: ${id}`);
            return result;
        } catch (error) {
            logger.error(`Error deleting anggota with ID ${id}: ${error.message}`);
            throw error;
        }
    },

    searchAnggota: async (keyword) => {
        const sql = "SELECT * FROM anggota WHERE nama LIKE ? OR alamat LIKE ? OR no_hp LIKE ?";
        const searchKeyword = `%${keyword}%`;
        try {
            const [rows] = await db.query(sql, [searchKeyword, searchKeyword, searchKeyword]);
            logger.info(`Searched anggota with keyword: ${keyword}`);
            return rows;
        } catch (error) {
            logger.error(`Error searching anggota with keyword ${keyword}: ${error.message}`);
            throw error;
        }
    }
};