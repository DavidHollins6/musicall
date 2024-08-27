import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { ClientOnly } from "remix-utils/client-only";
import { requireAuthSession } from "../modules/auth/session.server";
import { WaitPage } from "../components/pages/WaitPage";
import { useLoaderData } from "@remix-run/react";
import { getOwnedRooms, getRoom, getRoomAllowList } from "@musicall/api/room";
import { getUser } from "@musicall/api/user";

export async function loader({ request }: LoaderFunctionArgs) {
    const { userId } = await requireAuthSession(request);

    const url = new URL(request.url);
    const roomId = url.searchParams.get("roomId");

    if (!roomId) {
        return redirect("/");
    }

    const ownedRooms = await getOwnedRooms(userId);
    const ownsThisRoom = ownedRooms.findIndex((r) => r.id === roomId) >= 0;

    if (ownsThisRoom) {
        return redirect(`/call?roomId=${roomId}`);
    }

    const room = await getRoom(roomId);
    if (!room) {
        return redirect("/");
    }

    console.log(room);
    const roomOwner = await getUser(room.ownerId);

    if (!roomOwner) {
        return redirect("/");
    }
    const allowList = await getRoomAllowList(roomId);
    const allowedIntoRoom = allowList.includes(userId);

    return json({ userId, roomId, allowedIntoRoom, roomOwner });
}

export default function Wait() {
    const { roomId, userId, allowedIntoRoom, roomOwner } = useLoaderData<typeof loader>();

    return (
        <ClientOnly>
            {() => <WaitPage roomOwner={roomOwner} roomId={roomId} userId={userId} allowedIntoRoom={allowedIntoRoom} />}
        </ClientOnly>
    );
}
