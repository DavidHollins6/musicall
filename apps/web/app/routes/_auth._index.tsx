import { type LinksFunction, type LoaderFunctionArgs, json } from "@remix-run/node";

import styles from "../styles/global.css?url";
import { requireAuthSession } from "../modules/auth/session.server";
import { getOwnedRooms } from "@musicall/api/room";
import { Link, useLoaderData } from "@remix-run/react";
import { ActionIcon, Box, Card, Center, Group, Stack, Title, Tooltip } from "@mantine/core";
import { useSessionStore } from "../store/sessionStore";
import { IconCopy, IconDoor } from "@tabler/icons-react";

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
        <Center pos="relative">
            {rooms.map((room) => (
                <Card w="300px" h="300px" withBorder shadow="md" radius="50%" key={room.id}>
                    <Center h="100%">
                        <Stack>
                            <Box>
                                <Title order={2}>{user?.name}&#39;s Room</Title>
                            </Box>
                            <Center>
                                <Group justify="flex-end">
                                    <Tooltip label="Copy link">
                                        <ActionIcon variant="default" size="xl">
                                            <IconCopy />
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label="Enter room">
                                        <ActionIcon
                                            component={Link}
                                            to={`/call?roomId=${room.id}`}
                                            variant="default"
                                            size="xl"
                                        >
                                            <IconDoor />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            </Center>
                        </Stack>
                    </Center>
                </Card>
            ))}
            <Title order={1} top="20px" left="20px" pos="absolute">
                Welcome to Musicall
            </Title>
        </Center>
    );
}
