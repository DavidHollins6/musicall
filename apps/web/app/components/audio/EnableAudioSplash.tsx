import { Box, Button, Title } from "@mantine/core";
import { useSoundStateMachine } from "../../machines/soundMachine.client";

export function EnableAudioSplash({ onEnable }: { onEnable: () => void }) {
    const soundStateMachine = useSoundStateMachine();
    return (
        <Box>
            <Title>Press this button to enable audio</Title>
            <Button
                onClick={() => {
                    soundStateMachine.send({ type: "sound.enableManagers" });
                    onEnable();
                }}
            >
                Enable
            </Button>
        </Box>
    );
}
