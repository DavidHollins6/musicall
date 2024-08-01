import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PeersProvider } from "../store/peersContext";
import { DeviceProvider } from "../store/deviceContext";
import CallPage from "..//components/pages/CallPage";
import { ClientOnly } from "remix-utils/client-only";
import { requireAuthSession } from "../modules/auth/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const { userId, email } = await requireAuthSession(request);

    return json({ userId, email });
}

export default function Call() {
    const data = useLoaderData<typeof loader>();

    return (
        <ClientOnly>
            {() => (
                <PeersProvider>
                    <DeviceProvider>
                        {data.email}
                        <CallPage />
                    </DeviceProvider>
                </PeersProvider>
            )}
        </ClientOnly>
    );
}
