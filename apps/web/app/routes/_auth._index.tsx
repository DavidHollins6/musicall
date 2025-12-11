import { type LinksFunction, type LoaderFunctionArgs, json, ActionFunctionArgs } from "@remix-run/node";

import styles from "../styles/global.css?url";
import { createRoom, getOwnedRooms } from "@musicall/api/room";
import { redirect } from "@remix-run/node";
import { Link, useLoaderData, Form } from "@remix-run/react";
import { ActionIcon, Box, Button, Card, Center, Group, Stack, Title, Tooltip } from "@mantine/core";
import { useSessionStore } from "../store/sessionStore";
import { IconCopy, IconDoor } from "@tabler/icons-react";
import { getAuth } from "@clerk/remix/ssr.server";

export async function action({ request }: ActionFunctionArgs) {
    const body = await request.formData();
    const roomId = crypto.randomUUID();

    await createRoom({ id: roomId, ownerId: body.get("ownerId") as string, name: "Fun room!" });
    throw redirect(`/call?roomId=${roomId}`);
}

export async function loader(args: LoaderFunctionArgs) {
    const { isAuthenticated, userId } = await getAuth(args);

    if (!isAuthenticated) {
        return redirect("/sign-in");
    }
    const rooms = await getOwnedRooms(userId);

    return json({ rooms });
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function Index() {
    const { user } = useSessionStore();
    const { rooms } = useLoaderData<typeof loader>();

    return (
        <Center h="100%" pos="relative">
            <Form reloadDocument method="post">
                <input type="hidden" name="ownerId" value={user?.id} />
                user: {user?.id}
                <Button type="submit">Create Room</Button>
            </Form>
            {rooms.map((room) => (
                <Card w="300px" h="300px" withBorder shadow="md" radius="50%" key={room.id}>
                    <Center h="100%">
                        <Stack>
                            <Box>
                                <Title order={2}>{user?.firstName}&#39;s Room</Title>
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
