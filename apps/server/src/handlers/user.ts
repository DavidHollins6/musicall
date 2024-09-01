import type { Express, Request } from "express";
import { users } from "@musicall/storage";
import { eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export const userHandlers = (app: Express, db: PostgresJsDatabase) => {
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

    app.post(
        "/user/create/:id",
        async (req: Request<{ id: string }, unknown, { email: string; name: string }>, res) => {
            const { email, name } = req.body;

            const result = await db.insert(users).values({ email, id: req.params.id, name }).returning();

            res.status(200).send(result);
        },
    );
};
