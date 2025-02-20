import {
    Group,
    Button,
    Divider,
    Box,
    Burger,
    Drawer,
    ScrollArea,
    rem,
    ActionIcon,
    Menu,
    Text,
    VisuallyHidden,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./header.module.css";
import { useSessionStore } from "../../store/sessionStore";
import { Form, Link } from "@remix-run/react";
import { IconMenu2, IconLogout, IconSettings } from "@tabler/icons-react";
import { useRef } from "react";

export const Header = () => {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const { user } = useSessionStore();
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <Box bg="indigo.0">
            <header className={classes.header}>
                <VisuallyHidden>
                    <Form ref={formRef} action="/logout" method="POST">
                        <Button type="submit" variant="default">
                            Log out
                        </Button>
                    </Form>
                </VisuallyHidden>
                <Group justify="space-between" h="100%">
                    <Text>Musicall</Text>
                    {user ? (
                        <Group visibleFrom="sm">
                            <Menu shadow="md" width={200}>
                                <Menu.Target>
                                    <ActionIcon size="lg" variant="default">
                                        <IconMenu2 />
                                    </ActionIcon>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Item
                                        component={Link}
                                        to="/settings"
                                        leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
                                    >
                                        Settings
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item
                                        color="red"
                                        onClick={() => {
                                            formRef.current?.submit();
                                        }}
                                        leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                                    >
                                        Logout
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Group>
                    ) : (
                        <Group visibleFrom="sm">
                            <Button variant="default">Log in</Button>
                            <Button>Sign up</Button>
                        </Group>
                    )}

                    <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
                </Group>
            </header>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Navigation"
                hiddenFrom="sm"
                zIndex={1000000}
            >
                <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
                    <Divider my="sm" />

                    <Group justify="center" grow pb="xl" px="md">
                        <Button variant="default">Log in</Button>
                        <Button>Sign up</Button>
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box>
    );
};
