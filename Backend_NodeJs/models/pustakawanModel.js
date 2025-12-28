import baseLogger from "../src/utils/logger.js";
const logger = baseLogger.child({ context: 'PustakawanModel' });

export const pustakawanModel = {
    getAllPustakawan: async (conn) => {
        const sql = "SELECT id_pustakawan, email FROM pustakawan";
        const [results] = await conn.query(sql);
        logger.info(`Retrieved ${results.length} pustakawan records`);
        return results;
    },

    getPustakawanById: async (conn, id) => {
        const sql = "SELECT id_pustakawan, email FROM pustakawan WHERE id_pustakawan = ?";
        const [results] = await conn.query(sql, [id]);
        logger.info(`Retrieved pustakawan with ID: ${id}`);
        return results[0] || null;
    },

    getPustakawanByEmail: async (conn, email) => {
        const sql = "SELECT * FROM pustakawan WHERE email = ?";
        const [results] = await conn.query(sql, [email]);
        logger.info(`Retrieved pustakawan with email: ${email}`);
        return results[0] || null;
    },

    insertPustakawan: async (conn, pustakawanData) => {
        const sql = "INSERT INTO pustakawan SET ?";
        const [result] = await conn.query(sql, [pustakawanData]);
        logger.info(`Inserted new pustakawan with ID: ${result.insertId}`);
        return result;
    }
};