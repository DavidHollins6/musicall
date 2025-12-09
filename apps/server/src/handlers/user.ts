import type { Express } from "express";
import { ClerkClient } from "@clerk/backend";

export const userHandlers = (app: Express, clerk: ClerkClient) => {
    app.get("/user/:id", async (req, res) => {
        const user = clerk.users.getUser(req.params.id);

        if (user) {
            res.send(user);
            return;
        }

        res.status(404).send();
    });

    app.get("/user/email/:email", async (req, res) => {
        const user = clerk.emailAddresses.getEmailAddress(req.params.email);
        if (user) {
            res.send(user);
            return;
        }

        res.status(404).send();
    });
};
