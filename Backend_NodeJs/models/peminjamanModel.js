import db from '../config/database.js';
import baseLogger from "../src/utils/logger.js";
const logger = baseLogger.child({ context: 'PeminjamanModel' });

export const peminjamanModel = {
    getAllPeminjaman: async () => {
        const sql = "SELECT * FROM peminjaman JOIN buku ON peminjaman.id_buku = buku.id_buku JOIN anggota ON peminjaman.id_anggota = anggota.id_anggota";
        try {
            const [rows] = await db.query(sql);
            logger.info("Retrieved all peminjaman from database");
            return rows;
        } catch (error) {
            logger.error(`Error retrieving all peminjaman: ${error.message}`);
            throw error;
        }
    },

    getPeminjamanById: async (id) => {
        const sql = "SELECT * FROM peminjaman WHERE id_peminjaman = ?";
        try {
            const [rows] = await db.query(sql, [id]);
            logger.info(`Retrieved peminjaman with ID: ${id}`);
            return rows[0] || null;
        } catch (error) {
            logger.error(`Error retrieving peminjaman with ID ${id}: ${error.message}`);
            throw error;
        }
    },

    insertPeminjaman: async (peminjamanData) => {
        const sql = "INSERT INTO peminjaman SET ?";
        try {
            const [result] = await db.query(sql, peminjamanData);
            logger.info(`Inserted new peminjaman with ID: ${result.insertId}`);
            return result;
        } catch (error) {
            logger.error(`Error inserting new peminjaman: ${error.message}`);
            throw error;
        }
    },

    updatePeminjaman: async (id, peminjamanData) => {
        const sql = "UPDATE peminjaman SET ? WHERE id_peminjaman = ?";
        try {
            const [result] = await db.query(sql, [peminjamanData, id]);
            logger.info(`Updated peminjaman with ID: ${id}`);
            return result;
        } catch (error) {
            logger.error(`Error updating peminjaman with ID ${id}: ${error.message}`);
            throw error;
        }
    },

    deletePeminjaman: async (id) => {
        const sql = "DELETE FROM peminjaman WHERE id_peminjaman = ?";
        try {
            const [result] = await db.query(sql, [id]);
            logger.info(`Deleted peminjaman with ID: ${id}`);
            return result;
        } catch (error) {
            logger.error(`Error deleting peminjaman with ID ${id}: ${error.message}`);
            throw error;
        }
    },

    searchPeminjaman: async (keyword) => {
        const sql = `SELECT * FROM peminjaman JOIN buku ON peminjaman.id_buku = buku.id_buku JOIN anggota ON peminjaman.id_anggota = anggota.id_anggota
                     WHERE buku.judul LIKE ? OR anggota.nama_anggota LIKE ?`;
        const searchKeyword = `%${keyword}%`;
        try {
            const [rows] = await db.query(sql, [searchKeyword, searchKeyword]);
            logger.info(`Searched peminjaman with keyword: ${keyword}`);
            return rows;
        } catch (error) {
            logger.error(`Error searching peminjaman with keyword ${keyword}: ${error.message}`);
            throw error;
        }
    }
};