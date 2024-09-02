import { type LinksFunction, type LoaderFunctionArgs, json } from "@remix-run/node";

import styles from "../styles/global.css?url";
import { requireAuthSession } from "../modules/auth/session.server";
import { getOwnedRooms } from "@musicall/api/room";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { Button, Space } from "@mantine/core";
import { useSessionStore } from "../store/sessionStore";

export async function loader({ request }: LoaderFunctionArgs) {
    const { userId } = await requireAuthSession(request);

    const rooms = await getOwnedRooms(userId);

    return json({ rooms });
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function Index() {
    const { user } = useSessionStore();
    const { rooms } = useLoaderData<typeof loader>();

    return (
        <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
            <h1>Hello {user?.name}</h1>
            <Form method="post" action="/logout">
                <Button type="submit">Logout</Button>
            </Form>
            <Space />
            Your rooms:
            <div>
                {rooms.map((room) => (
                    <Link to={`/call?roomId=${room.id}`} key={room.id}>
                        {room.id}
                    </Link>
                ))}
            </div>
        </div>
    );
}
