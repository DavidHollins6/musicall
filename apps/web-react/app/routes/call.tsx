import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PeersProvider } from "../store/peersContext";
import { DeviceProvider } from "../store/deviceContext";
import CallPage from "..//components/pages/CallPage";
import { ClientOnly } from "remix-utils/client-only";
import { requireAuthSession } from "../modules/auth/session.server";
import { db } from "../database/db.server";
import { rooms } from "../database/schema";
import { and, eq } from "drizzle-orm";
import { getRoomAllowList } from "@musicall/api/room";

export async function loader({ request }: LoaderFunctionArgs) {
    const { userId } = await requireAuthSession(request);

    console.log("loading call", userId);

    const url = new URL(request.url);
    const roomId = url.searchParams.get("roomId");

    console.log("loading room", roomId);

    if (!roomId) {
        return redirect("/");
    }

    const room = await db
        .select()
        .from(rooms)
        .where(and(eq(rooms.ownerId, userId), eq(rooms.id, roomId)));

    if (room.length === 0) {
        const allowList = await getRoomAllowList(roomId);

        if (allowList.includes(userId)) {
            return json({ userId, roomId });
        }
        return redirect(`/wait?roomId=${roomId}`);
    }

    return json({ userId, roomId });
}

export default function Call() {
    const { roomId, userId } = useLoaderData<typeof loader>();

    return (
        <ClientOnly>
            {() => (
                <PeersProvider>
                    <DeviceProvider>
                        <CallPage roomId={roomId} userId={userId} />
                    </DeviceProvider>
                </PeersProvider>
            )}
        </ClientOnly>
    );
}
