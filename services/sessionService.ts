import { randomUUID } from "expo-crypto";
import * as sessionRepo from "../repositories/sessionRepo";

export function addSession(practiceId: string, count: number) {

    sessionRepo.insertSession(
        randomUUID(),
        practiceId,
        count,
        Date.now(),
        0
    );

}

export function getSessionsForPractice(practiceId: string) {
    return sessionRepo.getSessionsByPractice(practiceId);
}

export function getDailyPracticeData(practiceId: string, days: number) {

    const rows = sessionRepo.getDailyTotals(practiceId);

    const today = new Date();

    const result: { date: string; total: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {

        const d = new Date(today);
        d.setDate(today.getDate() - i);

        const dayString =
            d.getFullYear() +
            "-" +
            String(d.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(d.getDate()).padStart(2, "0");

        const match = rows.find(r => r.day === dayString);

        result.push({
            date: dayString,
            total: match?.total ?? 0
        });

    }

    return result;
}