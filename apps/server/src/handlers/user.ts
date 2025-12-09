import type { Express, Request } from "express";
import { teacherStudents, users } from "@musicall/storage";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export const userHandlers = (app: Express, db: NodePgDatabase) => {
    app.get("/user/:id", async (req, res) => {
        const result = await db.select().from(users).where(eq(users.id, req.params.id));

        if (result.length === 1) {
            res.send(result[0]);
            return;
        }

        res.status(404).send();
    });

    app.get("/user/email/:email", async (req, res) => {
        const result = await db.select().from(users).where(eq(users.email, req.params.email));

        if (result.length === 1) {
            res.send(result[0]);
            return;
        }

        res.status(404).send();
    });

    app.get("/user/students/:userId", async (req, res) => {
        const result = await db
            .select()
            .from(teacherStudents)
            .innerJoin(users, eq(users.id, teacherStudents.studentId))
            .where(eq(teacherStudents.teacherId, req.params.userId));

        res.send(result.map((r) => r.users));
        return;
    });

    // app.post(
    //     "/user/create/:id",
    //     async (req: Request<{ id: string }, unknown, { email: string; name: string }>, res) => {
    //         const { email, name } = req.body;

    //         const result = await db.insert(users).values({ email, id: req.params.id, name }).returning();

    //         res.status(200).send(result);
    //     },
    // );
};
