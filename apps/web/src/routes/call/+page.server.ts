import { db } from "$lib/db/db";
import { eq } from "drizzle-orm";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { mappings, triggerTypes } from "$lib/db/schema";

export const load: PageServerLoad = async ({ url, locals: { getSession } }) => {
    const session = await getSession();
    if (!session) {
        throw redirect(302, "/login?redirect=" + url);
    }

    const mappingsRows = await db.select().from(mappings).where(eq(mappings.userId, session.user.id));

    const triggerTypeRows = await db.select().from(triggerTypes).where(eq(triggerTypes.instrumentTypeId, 1));

    return {
        mappings: mappingsRows,
        triggerTypes: triggerTypeRows,
    };
};
