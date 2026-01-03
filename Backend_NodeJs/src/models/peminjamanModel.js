import db from '../config/database.js';
import baseLogger from "../utils/logger.js";
const logger = baseLogger.child({ context: 'PeminjamanModel' });

export const peminjamanModel = {
    getAllPeminjaman: async (conn) => {
        const sql = "SELECT peminjaman.*, buku.judul, anggota.nama FROM peminjaman JOIN buku ON peminjaman.id_buku = buku.id_buku JOIN anggota ON peminjaman.id_anggota = anggota.id_anggota ORDER BY peminjaman.tanggal_pinjam DESC";
        const [results] = await conn.query(sql);
        logger.info(`Retrieved ${results.length} peminjaman records`);
        return results;
    },

    getPeminjamanById: async (conn, id) => {
        const sql = "SELECT peminjaman.*, buku.judul, anggota.nama FROM peminjaman JOIN buku ON peminjaman.id_buku = buku.id_buku JOIN anggota ON peminjaman.id_anggota = anggota.id_anggota WHERE id_peminjaman = ?";
        const [results] = await conn.query(sql, [id]);
        logger.info(`Retrieved peminjaman with ID: ${id}`);
        return results[0] || null;
    },

    insertPeminjaman: async (conn, peminjamanData) => {
        const sql = "INSERT INTO peminjaman SET ?";
        const [result] = await conn.query(sql, [peminjamanData]);
        logger.info(`Inserted new peminjaman with ID: ${result.insertId}`);
        return result;
    },

    updatePeminjaman: async (conn, id, peminjamanData) => {
        const sql = "UPDATE peminjaman SET ? WHERE id_peminjaman = ?";
        const [result] = await conn.query(sql, [peminjamanData, id]);
        logger.info(`Updated peminjaman with ID: ${id}`);
        return result;
    },

    deletePeminjaman: async (conn, id) => {
        const sql = "DELETE FROM peminjaman WHERE id_peminjaman = ?";
        const [result] = await conn.query(sql, [id]);
        logger.info(`Deleted peminjaman with ID: ${id}`);
        return result;
    },

    searchPeminjaman: async (conn, keyword) => {
        const sql = `SELECT * FROM peminjaman JOIN buku ON peminjaman.id_buku = buku.id_buku JOIN anggota ON peminjaman.id_anggota = anggota.id_anggota
                     WHERE buku.judul LIKE ? OR anggota.nama LIKE ?`;
        const searchKeyword = `%${keyword}%`;
        const [results] = await conn.query(sql, [searchKeyword, searchKeyword]);
        logger.info(`Found ${results.length} peminjaman records matching keyword: ${keyword}`);
        return results;
    },

    updateStatusPeminjaman: async (conn, id, status) => {
        const sql = "UPDATE peminjaman SET status = ?, tanggal_kembali = NOW() WHERE id_peminjaman = ?";
        const [result] = await conn.query(sql, [status, id]);
        logger.info(`Updated status of peminjaman with ID: ${id} to ${status}`);
        return result;
    }
};