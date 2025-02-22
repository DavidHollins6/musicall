import { useRef } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { ClientOnly } from "remix-utils/client-only";
import { requireAuthSession } from "../modules/auth/session.server";
import { useLoaderData } from "@remix-run/react";
import { getOwnedRooms, getRoom, getRoomAllowList } from "@musicall/api/room";
import { getUser } from "@musicall/api/user";
import { createUserStore, UserContext } from "../store/userStore";
import { LobbyPage } from "../components/pages/LobbyPage";

export async function loader({ request }: LoaderFunctionArgs) {
    const { userId } = await requireAuthSession(request);

    const user = await getUser(userId);

    if (!user) {
        return redirect("/");
    }

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

    const roomOwner = await getUser(room.ownerId);

    if (!roomOwner) {
        return redirect("/");
    }
    const allowList = await getRoomAllowList(roomId);
    const allowedIntoRoom = allowList.includes(userId);

    return json({
        userId,
        roomId,
        allowedIntoRoom,
        roomOwner,
        user,
        ENV: {
            SOCKET_URL: process.env.SOCKET_URL,
        },
    });
}

export default function Wait() {
    const { roomId, userId, allowedIntoRoom, roomOwner, user, ENV } = useLoaderData<typeof loader>();
    const store = useRef(createUserStore({ user, isOwner: false })).current;

    return (
        <ClientOnly>
            {() => (
                <UserContext.Provider value={store}>
                    <LobbyPage
                        roomOwner={roomOwner}
                        roomId={roomId}
                        userId={userId}
                        allowedIntoRoom={allowedIntoRoom}
                        socketUrl={ENV.SOCKET_URL}
                    />
                </UserContext.Provider>
            )}
        </ClientOnly>
    );
}
