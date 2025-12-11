import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "node:http";
import { roomHandlers } from "./handlers/room";
import admin from "firebase-admin";
import { userHandlers } from "./handlers/user";
import { Server } from "socket.io";
import NodeCache from "node-cache";
import { createClerkClient } from "@clerk/backend";
import { socketHandlers } from "./handlers/socket";

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.CLERK_SECRET_KEY) {
    throw new Error("CLERK_SECRET_KEY is not defined");
}

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
});

const db = admin.firestore();
const cache = new NodeCache();
const clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY || "",
});

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

app.use(express.json());

roomHandlers(app, db, cache);
userHandlers(app, clerk);
socketHandlers(io, cache);

app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.get("/socket-health", (req, res) => {
    const response = {
        connectedSockets: io.sockets.sockets.size,
        waitingList: cache
            .keys()
            .filter((key) => key.startsWith("waiters-"))
            .flatMap((key) => cache.get(key)),
    };
    res.send(response);
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
