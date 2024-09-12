import { type LinksFunction, type LoaderFunctionArgs, json } from "@remix-run/node";

import styles from "../styles/global.css?url";
import { requireAuthSession } from "../modules/auth/session.server";
import { getOwnedRooms } from "@musicall/api/room";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { ActionIcon, Box, Button, Card, Group, SimpleGrid, Space, Stack, Title, Tooltip } from "@mantine/core";
import { useSessionStore } from "../store/sessionStore";
import { IconCopy, IconDoorEnter } from "@tabler/icons-react";

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
        <Stack h="100%" p={32}>
            <Box>
                <Title>Hello {user?.name}</Title>
                Your rooms:
            </Box>
            <SimpleGrid
                flex={1}
                cols={3}
                style={{
                    gridTemplateRows: "1fr 1fr",
                }}
            >
                {rooms.map((room) => (
                    <Card withBorder key={room.id}>
                        <Stack h="100%" justify="space-between">
                            <Title order={2}>{room.name}</Title>
                            <Group justify="flex-end">
                                <Tooltip label="Copy link">
                                    <ActionIcon variant="default" size="lg">
                                        <IconCopy />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Enter room">
                                    <ActionIcon
                                        component={Link}
                                        to={`/call?roomId=${room.id}`}
                                        variant="default"
                                        size="lg"
                                    >
                                        <IconDoorEnter />
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        </Stack>
                    </Card>
                ))}
            </SimpleGrid>
        </Stack>
    );
}
