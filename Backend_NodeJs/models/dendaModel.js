import db from '../config/database.js';
import baseLogger from "../src/utils/logger.js";
const logger = baseLogger.child({ context: 'DendaModel' });

export const dendaModel = {
    getAllDenda: async () => {
        const sql = "SELECT denda.*, anggota.nama FROM denda JOIN peminjaman ON denda.id_peminjaman = peminjaman.id_peminjaman JOIN anggota ON peminjaman.id_anggota = anggota.id_anggota";
        try {
            const [rows] = await db.query(sql);
            logger.info("Retrieved all denda from database");
            return rows;
        } catch (error) {
            logger.error(`Error retrieving all denda: ${error.message}`);
            throw error;
        }
    },

    getDendaById: async (id) => {
        const sql = "SELECT * FROM denda WHERE id_denda = ?";
        try {
            const [rows] = await db.query(sql, [id]);
            logger.info(`Retrieved denda with ID: ${id}`);
            return rows[0] || null;
        } catch (error) {
            logger.error(`Error retrieving denda with ID ${id}: ${error.message}`);
            throw error;
        }
    },

    updateDenda: async (id, dendaData) => {
        const sql = "UPDATE denda SET ? WHERE id_denda = ?";
        try {
            const [result] = await db.query(sql, [dendaData, id]);
            logger.info(`Updated denda with ID: ${id}`);
            return result;
        } catch (error) {
            logger.error(`Error updating denda with ID ${id}: ${error.message}`);
            throw error;
        }
    },

    searchDenda: async (keyword) => {
        const sql = "SELECT * FROM denda JOIN peminjaman ON denda.id_peminjaman = peminjaman.id_peminjaman JOIN anggota ON peminjaman.id_anggota = anggota.id_anggota WHERE anggota.nama_anggota LIKE ?";
        const searchKeyword = `%${keyword}%`;
        try {
            const [rows] = await db.query(sql, [searchKeyword]);
            logger.info(`Searched denda with keyword: ${keyword}`);
            return rows;
        } catch (error) {
            logger.error(`Error searching denda with keyword ${keyword}: ${error.message}`);
            throw error;
        }
    }
};