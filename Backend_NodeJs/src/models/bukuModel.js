import baseLogger from '../utils/logger.js';
const logger = baseLogger.child({ context: 'BukuModel' });

export const bukuModel = {
    getAllBuku: async (conn) => {
        const sql = "SELECT * FROM buku";
        const [results] = await conn.query(sql);
        logger.info(`Retrieved ${results.length} buku records`);
        return results;
    },

    getBukuById: async (conn, id) => {
        const sql = "SELECT * FROM buku WHERE id_buku = ?";
        const [results] = await conn.query(sql, [id]);
        logger.info(`Retrieved buku with ID: ${id}`);
        return results[0] || null;
    },

    insertBuku: async (conn, bukuData) => {
        const sql = "INSERT INTO buku SET ?";
        const [result] = await conn.query(sql, [bukuData]);
        logger.info(`Inserted new buku with ID: ${result.insertId}`);
        return result;
    },

    updateBuku: async (conn, id, bukuData) => {
        const sql = "UPDATE buku SET ? WHERE id_buku = ?";
        const [result] = await conn.query(sql, [bukuData, id]);
        logger.info(`Updated buku with ID: ${id}`);
        return result;
    },

    deleteBuku: async (conn, id) => {
        const sql = "DELETE FROM buku WHERE id_buku = ?";
        const [result] = await conn.query(sql, [id]);
        logger.info(`Deleted buku with ID: ${id}`);
        return result;
    },

    searchBuku: async (conn, keyword) => {
        const sql = "SELECT * FROM buku WHERE judul LIKE ? OR penulis LIKE ? OR penerbit LIKE ?";
        const searchKeyword = `%${keyword}%`;
        const [results] = await conn.query(sql, [searchKeyword, searchKeyword, searchKeyword]);
        logger.info(`Found ${results.length} buku records matching keyword: ${keyword}`);
        return results;
    }
};