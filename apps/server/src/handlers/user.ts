import type { Express } from "express";
import { ClerkClient } from "@clerk/backend";

export const userHandlers = (app: Express, clerk: ClerkClient) => {
    app.get("/user/:id", async (req, res) => {
        const user = await clerk.users.getUser(req.params.id);

        if (user) {
            res.send(user);
            return;
        }

        res.status(404).send();
    });
};
