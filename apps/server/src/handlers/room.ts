import type { Express, Request } from "express";
import NodeCache from "node-cache";
import { Firestore, FirestoreDataConverter } from "firebase-admin/firestore";
import { Room } from "@musicall/storage";

export const roomHandlers = (app: Express, db: Firestore, cache: NodeCache) => {
    app.get("/room/:id", async (req, res) => {
        const roomRef = db.collection("rooms").withConverter(roomConverter).doc(req.params.id);

        const snapshot = await roomRef.get();

        if (!snapshot.exists) {
            return res.status(404).send("User not found");
        }

        return res.json(snapshot.data());
    });

    app.get("/room/:id/allow-list", async (req, res) => {
        const waiters =
            cache.get<Array<{ userId: string; name: string; allowed: boolean }>>(`waiters-${req.params.id}`) || [];
        const allowedPeople = waiters.filter((w) => w.allowed).map((w) => w.userId);

        res.status(200).send(allowedPeople);
    });

    app.get("/room/owned/:id", async (req, res) => {
        const ownedRoomsRef = await db
            .collection("rooms")
            .where("ownerId", "==", req.params.id)
            .withConverter(roomConverter)
            .get();

        const ownedRooms = ownedRoomsRef.docs.map((doc) => doc.data());

        if (ownedRooms.length > 0) {
            res.send(ownedRooms);
            return;
        }

        res.status(404).send();
    });

    app.post(
        "/room/create/:id",
        async (req: Request<{ id: string }, unknown, { name: string; ownerId: string }>, res) => {
            const { ownerId, name } = req.body;
            const { id } = req.params;

            await db.collection("rooms").doc(id).set({
                ownerId,
                name,
            });

            res.status(201).send({});
        },
    );
};

export const roomConverter: FirestoreDataConverter<Room> = {
    toFirestore(item: Room) {
        return {
            name: item.name,
            ownerId: item.ownerId,
        };
    },
    fromFirestore(snapshot) {
        const data = snapshot.data();
        return {
            id: snapshot.id,
            name: data.name,
            ownerId: data.ownerId,
        };
    },
};
