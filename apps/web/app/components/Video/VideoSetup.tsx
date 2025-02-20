import { Video } from ".";
import { Button, Box, Group, LoadingOverlay, NativeSelect, useMatches } from "@mantine/core";
import { useVideoStateMachine, videoActor } from "../../machines/videoMachine";

export const VideoSetup = ({ onComplete }: { onComplete: () => void }) => {
    const videoStateMachine = useVideoStateMachine();
    videoStateMachine.context.stream?.getVideoTracks().forEach((vt) => (vt.enabled = true));
    const inputsGrow = useMatches({
        base: true,
        lg: false,
    });

    return (
        <Box pos="relative" h="100%">
            <Box style={{ height: "calc(100% - 78px)" }} bg="black" pos="relative">
                <Video stream={videoStateMachine.context.stream} />
            </Box>
            <LoadingOverlay
                visible={videoStateMachine.value === "initializing"}
                zIndex={1000}
                overlayProps={{ blur: 2 }}
                loaderProps={{
                    children: (
                        <Button
                            onClick={async () => {
                                videoActor.start();
                                videoStateMachine.send({ type: "video.toggle", enabled: true });
                            }}
                        >
                            Request Access to Camera
                        </Button>
                    ),
                }}
            />
            <Group h="78px" justify="space-between" grow={inputsGrow} align="flex-end">
                <NativeSelect
                    onChange={async (e) => {
                        const newDevice = videoStateMachine.context.availableDevices.find(
                            (d) => d.deviceId === e.currentTarget.value,
                        );
                        if (newDevice) {
                            videoStateMachine.send({ type: "video.setDevice", device: newDevice });
                        }
                    }}
                    label="Video"
                    data={videoStateMachine.context.availableDevices.map((m) => ({
                        label: m.label,
                        value: m.deviceId,
                    }))}
                />
                <Button onClick={onComplete}>Next</Button>
            </Group>
        </Box>
    );
};
