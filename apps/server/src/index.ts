import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "node:http";
import { roomHandlers } from "./handlers/room";
import { createDb } from "@musicall/storage";
import { userHandlers } from "./handlers/user";
import { Server } from "socket.io";
import NodeCache from "node-cache";
import { socketHandlers } from "./handlers/socket";

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}

const db = createDb(process.env.DATABASE_URL);
const cache = new NodeCache();

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

app.use(express.json());

roomHandlers(app, db, cache);
userHandlers(app, db);
socketHandlers(io, cache);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
