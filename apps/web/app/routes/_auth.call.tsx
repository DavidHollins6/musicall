import { useRef } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CallPage from "../components/pages/CallPage";
import { ClientOnly } from "remix-utils/client-only";
import { getOwnedRooms, getRoomAllowList } from "@musicall/api/room";
import { getUser } from "@musicall/api/user";
import { createUserStore, UserContext } from "../store/userStore";
import { DeviceChecker } from "../components/DeviceChecker";
import { getAuth } from "@clerk/remix/ssr.server";

export async function loader(args: LoaderFunctionArgs) {
    const { isAuthenticated, userId } = await getAuth(args);

    if (!isAuthenticated) {
        return redirect("/sign-in");
    }

    const user = await getUser(userId);

    if (!user) {
        return redirect("/");
    }

    const url = new URL(args.request.url);
    const roomId = url.searchParams.get("roomId");

    if (!roomId) {
        return redirect("/");
    }

    const rooms = await getOwnedRooms(userId);
    const ownsThisRoom = rooms.findIndex((r) => r.id === roomId) >= 0;
    const allowList = await getRoomAllowList(roomId);
    const isInAllowList = allowList.includes(userId);

    if (!ownsThisRoom && !isInAllowList) {
        return redirect(`/lobby?roomId=${roomId}`);
    }

    return json({
        user,
        roomId,
        isOwner: ownsThisRoom,
    });
}

export default function Call() {
    const { roomId, user, isOwner } = useLoaderData<typeof loader>();
    const store = useRef(createUserStore({ user, isOwner })).current;

    return (
        <ClientOnly>
            {() => (
                <UserContext.Provider value={store}>
                    <DeviceChecker>
                        {(device) => <CallPage device={device} roomId={roomId} isOwner={isOwner} />}
                    </DeviceChecker>
                </UserContext.Provider>
            )}
        </ClientOnly>
    );
}
