import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { roomHandlers } from "./handlers/room";
import { createCache, createDb } from "@musicall/storage";
import { userHandlers } from "./handlers/user";
import { sessionHandlers } from "./handlers/session";

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}

if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not defined");
}

if (!process.env.REDIS_PASSWORD) {
    throw new Error("REDIS_PASSWORD is not defined");
}

const db = createDb(process.env.DATABASE_URL);
const redis = createCache(process.env.REDIS_URL, process.env.REDIS_PASSWORD);

app.use(express.json());

roomHandlers(app, db, redis);
userHandlers(app, db);
sessionHandlers(app, db);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/redis-health", async (_, res) => {
    res.status(200).send(await redis.keys("*"));
});

app.get("/redis-set", async (_, res) => {
    await redis.set("TEST", "TEST", { EX: 200 });
    res.status(200).send();
});

app.get("/redis-clear", async (_, res) => {
    await redis.flushAll();
    res.status(200).send();
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
