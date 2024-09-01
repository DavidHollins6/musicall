import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PeersProvider } from "../store/peersContext";
import { DeviceProvider } from "../store/deviceContext";
import CallPage from "../components/pages/CallPage";
import { ClientOnly } from "remix-utils/client-only";
import { requireAuthSession } from "../modules/auth/session.server";
import { getOwnedRooms, getRoomAllowList } from "@musicall/api/room";
import { getUser } from "@musicall/api/user";

export async function loader({ request }: LoaderFunctionArgs) {
    const { userId } = await requireAuthSession(request);

    const user = await getUser(userId);

    if (!user) {
        return redirect("/");
    }

    console.log("loading call", userId);

    const url = new URL(request.url);
    const roomId = url.searchParams.get("roomId");

    console.log("loading room", roomId);

    if (!roomId) {
        return redirect("/");
    }

    const rooms = await getOwnedRooms(userId);
    const ownsThisRoom = rooms.findIndex((r) => r.id === roomId) >= 0;
    const allowList = await getRoomAllowList(roomId);
    const isInAllowList = allowList.includes(userId);

    if (!ownsThisRoom && !isInAllowList) {
        return redirect(`/wait?roomId=${roomId}`);
    }

    return json({ user, roomId, isOwner: ownsThisRoom });
}

export default function Call() {
    const { roomId, user, isOwner } = useLoaderData<typeof loader>();

    return (
        <ClientOnly>
            {() => (
                <PeersProvider>
                    <DeviceProvider>
                        <CallPage roomId={roomId} user={user} isOwner={isOwner} />
                    </DeviceProvider>
                </PeersProvider>
            )}
        </ClientOnly>
    );
}
