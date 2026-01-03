import baseLogger from "../utils/logger.js";
const logger = baseLogger.child({ context: 'DendaModel' });

export const dendaModel = {
    getAllDenda: async (conn) => {
        const sql = "SELECT denda.*, anggota.nama FROM denda JOIN peminjaman ON denda.id_peminjaman = peminjaman.id_peminjaman JOIN anggota ON peminjaman.id_anggota = anggota.id_anggota ORDER BY denda.id_denda DESC";
        const [results] = await conn.query(sql);
        logger.info(`Retrieved ${results.length} denda records`);
        return results;
    },

    getDendaById: async (conn, id) => {
        const sql = "SELECT * FROM denda WHERE id_denda = ?";
        const [results] = await conn.query(sql, [id]);
        logger.info(`Retrieved denda with ID: ${id}`);
        return results[0] || null;
    },

    updateDenda: async (conn, id, dendaData) => {
        const sql = "UPDATE denda SET ? WHERE id_denda = ?";
        const [result] = await conn.query(sql, [dendaData, id]);
        logger.info(`Updated denda with ID: ${id}`);
        return result;
    },

    searchDenda: async (conn, keyword) => {
        const sql = "SELECT * FROM denda JOIN peminjaman ON denda.id_peminjaman = peminjaman.id_peminjaman JOIN anggota ON peminjaman.id_anggota = anggota.id_anggota WHERE anggota.nama LIKE ?";
        const searchKeyword = `%${keyword}%`;
        const [results] = await conn.query(sql, [searchKeyword]);
        logger.info(`Searched denda with keyword: ${keyword}`);
        return results;
    }
};