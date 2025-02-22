import { Box, Button, Title } from "@mantine/core";
import { useMidiStateMachine } from "../../machines/midiMachine.client";

export function EnableAudioSplash({ onEnable }: { onEnable: () => void }) {
    const midiStateMachine = useMidiStateMachine();
    return (
        <Box>
            <Title>Press this button to enable audio</Title>
            <Button
                onClick={() => {
                    midiStateMachine.send({ type: "midi.enableManagers" });
                    onEnable();
                }}
            >
                Enable
            </Button>
        </Box>
    );
}
