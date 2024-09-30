import { useState } from "react";
import { Video } from ".";
import { Button, Box, Group, LoadingOverlay, NativeSelect } from "@mantine/core";
import { useCameraState } from "../../hooks/useCameraState";

export const VideoSetup = ({ onComplete }: { onComplete: () => void }) => {
    const { selectedDevice, devices, select, mediaStream, setDevices } = useCameraState();
    const [requestedAccess, setRequestedAccess] = useState(false);

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
                                await navigator.mediaDevices.getUserMedia({
                                    video: true,
                                });

                                const allDevices = await navigator.mediaDevices.enumerateDevices();
                                const videoDevices = allDevices.filter((d) => d.kind === "videoinput");

                                if (videoDevices.length > 0) {
                                    setDevices(videoDevices);

                                    select(videoDevices[0].deviceId);
                                }

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
