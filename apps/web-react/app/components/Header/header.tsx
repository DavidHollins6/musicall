import { Group, Button, Divider, Box, Burger, Drawer, ScrollArea, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./header.module.css";

export const Header = () => {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    return (
        <Box>
            <header className={classes.header}>
                <Group justify="flex-end" h="100%">
                    <Group visibleFrom="sm">
                        <Button variant="default">Log in</Button>
                        <Button>Sign up</Button>
                    </Group>

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
