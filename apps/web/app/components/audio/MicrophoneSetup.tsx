import { useState } from "react";
import { Button, Box, Group, LoadingOverlay, NativeSelect, Progress } from "@mantine/core";
import { useMicrophoneState } from "../../hooks/useMicrophoneState";
import { useMicVolume } from "../../hooks/useMicVolume";

export const MicrophoneSetup = ({ onComplete }: { onComplete: () => void }) => {
    const [requestedAccess, setRequestedAccess] = useState(false);
    const { refreshDevices, devices, select, mediaStream } = useMicrophoneState();
    const { audioLevel } = useMicVolume(mediaStream);

    return (
        <Box pos="relative" h="100%">
            <Box style={{ height: "calc(100% - 78px)" }} pos="relative">
                <Progress value={audioLevel} />
            </Box>
            <LoadingOverlay
                visible={!requestedAccess}
                zIndex={1000}
                overlayProps={{ blur: 2 }}
                loaderProps={{
                    children: (
                        <Button
                            onClick={async () => {
                                await refreshDevices();

                                select(devices[0].deviceId);
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
