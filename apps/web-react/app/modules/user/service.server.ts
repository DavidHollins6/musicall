import { createUser as createUserApi } from "@musicall/api/user";
import type { AuthSession } from "../auth/types";
import { createEmailAuthAccount, signInWithEmail, deleteAuthAccount } from "../auth/service.server";
import { User } from "@musicall/storage/types";

export type NonNullableFields<T> = {
    [P in keyof T]: NonNullable<T[P]>;
};

async function createUser({ email, id, name }: NonNullableFields<User>) {
    return await createUserApi(id, email, name);
}

export async function tryCreateUser({ email, id, name }: NonNullableFields<User>) {
    const user = await createUser({
        id,
        email,
        name,
    });

    // user account created and have a session but unable to store in User table
    // we should delete the user account to allow retry create account again
    if (!user) {
        await deleteAuthAccount(id);
        return null;
    }

    return user;
}

export async function createUserAccount(email: string, password: string, name: string): Promise<AuthSession | null> {
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

    const user = await tryCreateUser({ email, id: authAccount.id, name: name });

    if (!user) return null;

    return authSession;
}
