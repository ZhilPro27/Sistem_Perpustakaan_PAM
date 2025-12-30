import db from "./src/config/database.js";
import bcrypt from "bcryptjs";
import baseLogger from "./src/utils/logger.js";
const logger = baseLogger.child({ context: 'Seeding' });

const seedPustakawan = async () => {
    const conn = await db.getConnection();
    logger.info("Database connection established for seeding pustakawan");
    try {
        const hashedPassword = await bcrypt.hash("password123", 10);
        const [result] = await conn.execute(
            "INSERT INTO pustakawan (email, password) VALUES (?, ?)",
            ["admin2@perpus.com", hashedPassword]
        );
        logger.info(`Seeded pustakawan with ID: ${result.insertId}`);
    } catch (error) {
        logger.error(`Error seeding pustakawan: ${error.message}`);
    } finally {
        conn.release();
        logger.info("Database connection released after seeding pustakawan");
    }
};

const runSeeding = async () => {
    await seedPustakawan();
    process.exit(0);
};

runSeeding();