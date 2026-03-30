import { db, initializeDatabase } from "../database/db";
import { seedPractices } from "../database/seed";
import * as deletedRecordRepo from "../repositories/deletedRecordRepo";
import * as practiceRepo from "../repositories/practiceRepo";
import * as sessionRepo from "../repositories/sessionRepo";
import * as authService from "../services/authService";
import * as syncService from "../services/syncService";
import { emitDataChanged } from "../utils/events";
import { initializeNetworkListener } from "./networkService";
import { initializeSyncRetry } from "./syncService";

export async function initializeApp() {
    initializeDatabase();
    initializeNetworkListener();
    initializeSyncRetry();

    const existing = db.getAllSync(
        `SELECT COUNT(*) as count FROM practices`
    ) as { count: number }[];

    if (existing[0].count === 0) {
        seedPractices();
    }

    await authService.initializeAuth();
}

export async function restoreDefaults() {
    const userId = authService.getCurrentUserId();

    db.execSync("BEGIN TRANSACTION");

    try {

        sessionRepo.deleteAllSessions();
        practiceRepo.deleteAllPractices();
        deletedRecordRepo.deleteAllDeletedRecords();

        seedPractices();

        db.execSync("COMMIT");

        emitDataChanged();

        if (userId) {
            await syncService.wipeRemoteUserData(userId);
            await syncService.syncNow(userId);
        }

    } catch (error) {
        db.execSync("ROLLBACK");
        throw error;
    }
}