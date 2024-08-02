import type { Express, Request } from "express";
import { rooms } from "@musicall/storage/schema";
import { RedisCache } from "@musicall/storage/cache";
import { eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export const roomHandlers = (
  app: Express,
  db: PostgresJsDatabase,
  redis: RedisCache
) => {
  app.get("/room/:id", async (req, res) => {
    const roomsResult = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, req.params.id));

    if (roomsResult.length === 1) {
      res.send(roomsResult[0]);
      return;
    }

    res.status(404).send();
  });

  app.post(
    "/room/:id/allow",
    async (req: Request<{ id: string }, unknown, { userId: string }>, res) => {
      await redis.set(`allow-list|${req.body.userId}|${req.params.id}`, "", {
        EX: 30 * 60,
      });

      res.status(200).send();
    }
  );

  app.get("/room/:id/allow-list", async (req, res) => {
    const keys = await redis.keys(`allow-list|*${req.params.id}*`);
    const userIds = keys.map((key) => key.split("|")[2]);

    res.status(200).send(userIds);
  });
};
