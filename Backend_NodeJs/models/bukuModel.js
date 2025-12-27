import db from '../config/database.js';
import fs from 'fs';
import path from 'path';
import baseLogger from '../src/utils/logger.js';
const logger = baseLogger.child({ context: 'BukuModel' });

export const bukuModel = {
    getAllBuku: async () => {
        const sql = "SELECT * FROM buku";
        try {
            const [rows] = await db.query(sql);
            logger.info("Retrieved all buku from database");
            return rows;
        } catch (error) {
            logger.error(`Error retrieving all buku: ${error.message}`);
            throw error;
        }
    },

    getBukuById: async (id) => {
        const sql = "SELECT * FROM buku WHERE id_buku = ?";
        try {
            const [rows] = await db.query(sql, [id]);
            logger.info(`Retrieved buku with ID: ${id}`);
            return rows[0] || null;
        } catch (error) {
            logger.error(`Error retrieving buku with ID ${id}: ${error.message}`);
            throw error;
        }
    },

    insertBuku: async (bukuData) => {
        const sql = "INSERT INTO buku SET ?";
        try {
            const [result] = await db.query(sql, bukuData);
            logger.info(`Inserted new buku with ID: ${result.insertId}`);
            return result;
        } catch (error) {
            logger.error(`Error inserting new buku: ${error.message}`);
            throw error;
        }
    },

    updateBuku: async (id, bukuData) => {
        const sql = "UPDATE buku SET ? WHERE id_buku = ?";
        if (bukuData.gambar) { 
            try {
                const [existingBuku] = await db.query("SELECT gambar FROM buku WHERE id_buku = ?", [id]);
                if (existingBuku.length > 0) {
                    const oldImage = existingBuku[0].gambar;
                    if (oldImage) {
                        const imagePath = path.join(process.cwd(), 'uploads', oldImage);
                        fs.unlink(imagePath, (err) => { 
                            if (err) {
                                logger.error(`Gagal menghapus gambar lama: ${err}`);
                            } else {
                                logger.info(`Gambar lama dihapus: ${imagePath}`);
                            }
                        });
                    }
                }
            } catch (error) {
                logger.error(`Error saat mengambil data buku untuk menghapus gambar lama: ${error}`);
            }
        }
        try {
            const [result] = await db.query(sql, [bukuData, id]);
            logger.info(`Updated buku with ID: ${id}`);
            return result;
        } catch (error) {
            logger.error(`Error updating buku with ID ${id}: ${error.message}`);
            throw error;
        }
    },

    deleteBuku: async (id) => {
        const sql = "DELETE FROM buku WHERE id_buku = ?";
        try {
            const [existingBuku] = await db.query("SELECT gambar FROM buku WHERE id_buku = ?", [id]);
            if (existingBuku.length > 0) {
                const imageToDelete = existingBuku[0].gambar;
                if (imageToDelete) {
                    const imagePath = path.join(process.cwd(), 'uploads', imageToDelete);
                    fs.unlink(imagePath, (err) => { 
                        if (err) {
                            logger.error(`Gagal menghapus gambar saat menghapus buku: ${err}`);
                        } else {
                            logger.info(`Gambar buku dihapus: ${imagePath}`);
                        }
                    });
                }
            }
            const [result] = await db.query(sql, [id]);
            logger.info(`Deleted buku with ID: ${id}`);
            return result;
        } catch (error) {
            logger.error(`Error deleting buku with ID ${id}: ${error.message}`);
            throw error;
        }
    },

    searchBuku: async (keyword) => {
        const sql = "SELECT * FROM buku WHERE judul LIKE ? OR penulis LIKE ? OR penerbit LIKE ?";
        const searchKeyword = `%${keyword}%`;
        try {
            const [rows] = await db.query(sql, [searchKeyword, searchKeyword, searchKeyword]);
            logger.info(`Searched buku with keyword: ${keyword}`);
            return rows;
        } catch (error) {
            logger.error(`Error searching buku with keyword ${keyword}: ${error.message}`);
            throw error;
        }
    }
};