import { type LinksFunction, type LoaderFunctionArgs, json } from "@remix-run/node";

import styles from "../styles/global.css?url";
import { requireAuthSession } from "../modules/auth/session.server";
import { getOwnedRooms } from "@musicall/api/room";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { ActionIcon, Box, Button, Card, Group, SimpleGrid, Space, Stack, Text, Title, Tooltip } from "@mantine/core";
import { useSessionStore } from "../store/sessionStore";
import { IconCopy, IconDoor, IconDoorEnter, IconPlus, IconUserPlus } from "@tabler/icons-react";

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
            <Group flex={1} gap={12} align="start">
                {rooms.map((room) => (
                    <Card w="300px" h="300px" withBorder shadow="md" radius="md" key={room.id}>
                        <Stack h="100%" justify="space-between">
                            <Box>
                                <Title order={2}>{room.name}</Title>
                                <Text>Owner: You</Text>
                            </Box>
                            <Group justify="flex-end">
                                <Tooltip label="Invite Friends">
                                    <ActionIcon variant="default" size="lg">
                                        <IconUserPlus />
                                    </ActionIcon>
                                </Tooltip>
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
                                        <IconDoor />
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        </Stack>
                    </Card>
                ))}
                <Card w="300px" h="300px" shadow="md" radius="md" withBorder p={0}>
                    <ActionIcon onClick={() => {}} style={{ border: 0 }} variant="default" h="100%" w="100%">
                        <IconPlus size={100} />
                    </ActionIcon>
                </Card>
            </Group>
        </Stack>
    );
}
