import { db } from "$lib/db/db";
import { and, asc, eq } from "drizzle-orm";
import { instruments, triggerTypes, triggers } from "$lib/db/schema";
import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
    const instrumentId = url.searchParams.get("id");

    if (!instrumentId) {
        return { instrument: null, triggers: null };
    }

    const instrumentsResult = await db
        .select()
        .from(instruments)
        .where(eq(instruments.id, parseInt(instrumentId)));

    if (instrumentsResult.length <= 0) {
        return { instrument: null, triggers: null };
    }

    const instrument = instrumentsResult[0];
    const triggersResult = await db
        .select()
        .from(triggerTypes)
        .leftJoin(triggers, and(eq(triggerTypes.id, triggers.triggerTypeId), eq(triggers.id, parseInt(instrumentId))))
        .where(eq(triggerTypes.instrumentTypeId, instrument.instrumentTypeId))
        .orderBy(asc(triggerTypes.order));

    return { instrument, triggers: triggersResult };
};

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const entries = Object.fromEntries(data.entries()) as { instrumentId: string } | Record<string, string>;
        const instrumentId = entries.instrumentId;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { instrumentId: _, ...newTriggers } = entries;

        if (instrumentId && Object.keys(newTriggers).length > 0) {
            Object.entries(newTriggers)
                .filter((t) => t[1])
                .forEach(async (trigger) => {
                    const [triggerTypeId, triggerValue] = trigger;

                    const existingTrigger = await db
                        .select()
                        .from(triggers)
                        .where(eq(triggers.triggerTypeId, parseInt(triggerTypeId)));

                    if (existingTrigger.length > 0) {
                        await db
                            .update(triggers)
                            .set({
                                value: triggerValue,
                            })
                            .where(eq(triggers.id, existingTrigger[0].id));
                    } else {
                        await db.insert(triggers).values({
                            instrumentId: parseInt(instrumentId),
                            value: triggerValue,
                            triggerTypeId: parseInt(triggerTypeId),
                        });
                    }
                });
        }
    },
} satisfies Actions;
