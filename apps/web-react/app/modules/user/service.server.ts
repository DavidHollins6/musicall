import { createUser as createUserApi } from "@musicall/api/user";
import type { AuthSession } from "../auth/types";
import { createEmailAuthAccount, signInWithEmail, deleteAuthAccount } from "../auth/service.server";

async function createUser({ email, userId }: Pick<AuthSession, "userId" | "email">) {
    return await createUserApi(userId, email);
}

export async function tryCreateUser({ email, userId }: Pick<AuthSession, "userId" | "email">) {
    const user = await createUser({
        userId,
        email,
    });

    // user account created and have a session but unable to store in User table
    // we should delete the user account to allow retry create account again
    if (!user) {
        await deleteAuthAccount(userId);
        return null;
    }

    return user;
}

export async function createUserAccount(email: string, password: string): Promise<AuthSession | null> {
    const authAccount = await createEmailAuthAccount(email, password);

    // ok, no user account created
    if (!authAccount) return null;

    const authSession = await signInWithEmail(email, password);

    // user account created but no session 😱
    // we should delete the user account to allow retry create account again
    if (!authSession) {
        await deleteAuthAccount(authAccount.id);
        return null;
    }

    const user = await tryCreateUser(authSession);

    if (!user) return null;

    return authSession;
}
