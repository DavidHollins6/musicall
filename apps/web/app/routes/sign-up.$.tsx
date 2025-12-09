import { SignUp } from "@clerk/remix";
import { Center } from "@mantine/core";

export default function Page() {
    return (
        <Center mt="xl">
            <SignUp />
        </Center>
    );
}
