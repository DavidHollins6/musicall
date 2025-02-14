import type { Express, Request } from "express";
import { rooms, RedisCache } from "@musicall/storage";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export const roomHandlers = (app: Express, db: NodePgDatabase, redis: RedisCache) => {
    app.get("/room/:id", async (req, res) => {
        const roomsResult = await db.select().from(rooms).where(eq(rooms.id, req.params.id));

        if (roomsResult.length === 1) {
            res.send(roomsResult[0]);
            return;
        }

        res.status(404).send();
    });

    app.post("/room/:id/allow", async (req: Request<{ id: string }, unknown, { userId: string }>, res) => {
        await redis.set(`allow-list|${req.body.userId}|${req.params.id}`, "", {
            EX: 30 * 60,
        });

        res.status(200).send();
    });

    app.get("/room/:id/allow-list", async (req, res) => {
        const keys = await redis.keys(`allow-list|*${req.params.id}*`);
        const userIds = keys.map((key) => key.split("|")[2]);

        res.status(200).send(userIds);
    });

    app.get("/room/owned/:id", async (req, res) => {
        const result = await db.select().from(rooms).where(eq(rooms.ownerId, req.params.id));

        if (result.length > 0) {
            res.send(result);
            return;
        }

        res.status(404).send();
    });

    app.post(
        "/room/create/:id",
        async (req: Request<{ id: string }, unknown, { name: string; ownerId: string }>, res) => {
            const { ownerId, name } = req.body;
            const { id } = req.params;

            const result = await db.insert(rooms).values({ id, ownerId, name }).returning();

            res.status(200).send(result);
        },
    );
};
