import { db, initializeDatabase } from "../database/db";
import { seedPractices } from "../database/seed";

export function initializeApp() {

    initializeDatabase();

    const existing = db.getAllSync(
        `SELECT COUNT(*) as count FROM practices`
    ) as { count: number }[];

    if (existing[0].count === 0) {
        seedPractices();
    }

}