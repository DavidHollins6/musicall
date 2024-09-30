import { useState } from "react";
import { Video } from ".";
import { Button, Box, Group, LoadingOverlay, NativeSelect } from "@mantine/core";
import { useCameraState } from "../../hooks/useCameraState";

export const VideoSetup = ({ onComplete }: { onComplete: () => void }) => {
    const [requestedAccess, setRequestedAccess] = useState(false);
    const { refreshDevices, selectedDevice, devices, select, mediaStream } = useCameraState();

    return (
        <Box pos="relative" h="100%">
            <Box style={{ height: "calc(100% - 78px)" }} bg="black" pos="relative">
                <Video key={selectedDevice} stream={mediaStream} />
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
                            Request Access to Camera
                        </Button>
                    ),
                }}
            />
            <Group h="78px" justify="space-between" align="flex-end">
                <NativeSelect
                    onChange={async (e) => {
                        select(e.currentTarget.value);
                    }}
                    label="Video"
                    data={devices.map((m) => ({ label: m.label, value: m.deviceId }))}
                />
                <Button onClick={onComplete}>Next</Button>
            </Group>
        </Box>
    );
};
