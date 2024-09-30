import { useState } from "react";
import { Button, Box, Group, LoadingOverlay, NativeSelect, Progress, Stack } from "@mantine/core";
import { useMicrophoneState } from "../../hooks/useMicrophoneState";
import { useMicVolume } from "../../hooks/useMicVolume";

export const MicrophoneSetup = ({ onComplete }: { onComplete: () => void }) => {
    const [requestedAccess, setRequestedAccess] = useState(false);
    const { setDevices, devices, select, mediaStream, microphone } = useMicrophoneState();
    const { audioLevel } = useMicVolume(mediaStream, 50);

    console.log(audioLevel);

    return (
        <Box pos="relative" h="100%">
            <Stack justify="center" style={{ height: "calc(100% - 78px)" }} pos="relative">
                Volume:
                <Progress value={audioLevel} />
            </Stack>
            <LoadingOverlay
                visible={!requestedAccess}
                zIndex={1000}
                overlayProps={{ blur: 2 }}
                loaderProps={{
                    children: (
                        <Button
                            onClick={async () => {
                                await navigator.mediaDevices.getUserMedia({
                                    audio: true,
                                });

                                const allDevices = await navigator.mediaDevices.enumerateDevices();
                                const audioDevices = allDevices.filter((d) => d.kind === "audioinput");

                                if (audioDevices.length > 0) {
                                    setDevices(audioDevices);

                                    select(audioDevices[0].deviceId);
                                    microphone.enable();
                                }

                                setRequestedAccess(true);
                            }}
                        >
                            Request Access to Microphone
                        </Button>
                    ),
                }}
            />
            <Group h="78px" justify="space-between" align="flex-end">
                <NativeSelect
                    onChange={async (e) => {
                        select(e.currentTarget.value);
                    }}
                    label="Microphone"
                    data={devices.map((m) => ({ label: m.label, value: m.deviceId }))}
                />
                <Button onClick={onComplete}>Next</Button>
            </Group>
        </Box>
    );
};
