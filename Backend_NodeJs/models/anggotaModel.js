import baseLogger from "../src/utils/logger.js";
const logger = baseLogger.child({ context: 'AnggotaModel' });

export const anggotaModel = {
    getAllAnggota: async (conn) => {
        const sql = "SELECT * FROM anggota";
        const [results] = await conn.query(sql);
        logger.info(`Retrieved ${results.length} anggota records`);
        return results;
    },

    getAnggotaById: async (conn, id) => {
        const sql = "SELECT * FROM anggota WHERE id_anggota = ?";
        const [results] = await conn.query(sql, [id]);
        logger.info(`Retrieved anggota with ID: ${id}`);
        return results[0] || null;
    },

    insertAnggota: async (conn, anggotaData) => {
        const sql = "INSERT INTO anggota SET ?";
        const [result] = await conn.query(sql, [anggotaData]);
        logger.info(`Inserted new anggota with ID: ${result.insertId}`);
        return result;
    },

    updateAnggota: async (conn, id, anggotaData) => {
        const sql = "UPDATE anggota SET ? WHERE id_anggota = ?";
        const [result] = await conn.query(sql, [anggotaData, id]);
        logger.info(`Updated anggota with ID: ${id}`);
        return result;
    },

    deleteAnggota: async (conn, id) => {
        const sql = "DELETE FROM anggota WHERE id_anggota = ?";
        const [result] = await conn.query(sql, [id]);
        logger.info(`Deleted anggota with ID: ${id}`);
        return result;
    },

    searchAnggota: async (conn,keyword) => {
        const sql = "SELECT * FROM anggota WHERE nama LIKE ? OR alamat LIKE ? OR no_hp LIKE ?";
        const searchKeyword = `%${keyword}%`;
        const [results] = await conn.query(sql, [searchKeyword, searchKeyword, searchKeyword]);
        logger.info(`Found ${results.length} anggota records matching keyword: ${keyword}`);
        return results;
    }
};