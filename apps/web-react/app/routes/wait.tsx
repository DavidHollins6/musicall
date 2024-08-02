import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { ClientOnly } from "remix-utils/client-only";
import { requireAuthSession } from "../modules/auth/session.server";
import { WaitPage } from "../components/pages/WaitPage";
import { rooms } from "~/database/schema";
import { and, eq } from "drizzle-orm";
import { db } from "~/database/db.server";
import { useLoaderData } from "@remix-run/react";
import { getRoomAllowList } from "@musicall/api/room";

export async function loader({ request }: LoaderFunctionArgs) {
    const { userId } = await requireAuthSession(request);

    const url = new URL(request.url);
    const roomId = url.searchParams.get("roomId");

    if (!roomId) {
        return redirect("/");
    }

    const room = await db
        .select()
        .from(rooms)
        .where(and(eq(rooms.ownerId, userId), eq(rooms.id, roomId)));

    if (room.length === 1) {
        return redirect(`/call?roomId=${roomId}`);
    }

    const allowList = await getRoomAllowList(roomId);
    const allowedIntoRoom = allowList.includes(userId);

    return json({ userId, roomId, allowedIntoRoom });
}

export default function Call() {
    const { roomId, userId, allowedIntoRoom } = useLoaderData<typeof loader>();

    return (
        <ClientOnly>{() => <WaitPage roomId={roomId} userId={userId} allowedIntoRoom={allowedIntoRoom} />}</ClientOnly>
    );
}
