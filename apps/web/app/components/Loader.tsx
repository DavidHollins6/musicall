import { Center, Loader, Stack, Text } from "@mantine/core";

export const FullWidthLoader = ({ message }: { message: string }) => {
    return (
        <Center h="100%">
            <Stack align="center">
                <Loader />
                <Text>{message}</Text>
            </Stack>
        </Center>
    );
};
