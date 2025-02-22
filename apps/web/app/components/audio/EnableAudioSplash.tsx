import { Box, Button, Title } from "@mantine/core";

export function EnableAudioSplash({ onEnable }: { onEnable: () => void }) {
    return (
        <Box>
            <Title>Press this button to enable audio</Title>
            <Button
                onClick={() => {
                    const howl = new Howl({
                        src: "./audio/applause.mp3",
                        html5: true,
                        preload: true,
                    });
                    howl.play();
                    onEnable();
                }}
            >
                Enable
            </Button>
        </Box>
    );
}
