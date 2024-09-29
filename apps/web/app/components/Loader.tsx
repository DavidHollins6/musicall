import { Center, Loader, Stack, Text } from "@mantine/core";

export const FullWidthLoader = () => {
    return (
        <Center h="100%">
            <Stack align="center">
                <Loader />
                <Text>Checking permissions</Text>
            </Stack>
        </Center>
    );
};
