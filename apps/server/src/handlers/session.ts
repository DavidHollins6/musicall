import type { Express, Response } from "express";
import { sessions, sessionsStudents, users } from "@musicall/storage";
import { and, eq, gt } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export const sessionHandlers = (app: Express, db: NodePgDatabase) => {
    app.get("/user/:id/sessions/upcoming", async (req, res) => {
        const sessionsResult = await db
            .select({
                id: sessions.id,
                startTime: sessions.startTime,
                endTime: sessions.endTime,
                type: sessions.type,
                instrument: sessions.instrument,
                name: sessions.name,
                cancelled: sessions.cancelled,
                teacherName: users.name,
            })
            .from(sessions)
            .innerJoin(sessionsStudents, eq(sessions.id, sessionsStudents.sessionId))
            .innerJoin(users, eq(users.id, sessions.teacherId))
            .where(and(eq(sessionsStudents.studentId, req.params.id), gt(sessions.startTime, new Date())));

        res.send(sessionsResult);
        return;
    });
};
