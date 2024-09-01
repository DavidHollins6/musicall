import { useState } from "react";
import { Video } from ".";
import { useCamera } from "../../hooks/useCamera";
import { Button, Box, Group, LoadingOverlay, NativeSelect } from "@mantine/core";

export const VideoSetup = ({ onComplete }: { onComplete: () => void }) => {
    const [stream, setStream] = useState<MediaStream>();
    const [requestedAccess, setRequestedAccess] = useState(false);
    const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState<string | null>(null);
    const [videoDevices, setVideoDevices] = useState<Array<MediaDeviceInfo>>([]);

    const { getStreamById, getVideoDevices } = useCamera();

    return (
        <Box pos="relative" h="100%">
            <Box style={{ height: "calc(100% - 78px)" }} bg="black" pos="relative">
                <Video key={selectedVideoDeviceId} stream={stream} />
            </Box>
            <LoadingOverlay
                visible={!requestedAccess}
                zIndex={1000}
                overlayProps={{ blur: 2 }}
                loaderProps={{
                    children: (
                        <Button
                            onClick={async () => {
                                const newVideoDevices = await getVideoDevices();
                                setVideoDevices(newVideoDevices);
                                const newStream = await getStreamById(newVideoDevices[0].deviceId);

                                if (!newStream) {
                                    return;
                                }

                                setStream(newStream);
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
                        setSelectedVideoDeviceId(e.currentTarget.value);
                        const newStream = await getStreamById(e.currentTarget.value);
                        if (!newStream) {
                            return;
                        }
                        setStream(newStream);
                    }}
                    label="Video"
                    data={videoDevices.map((m) => ({ label: m.label, value: m.deviceId }))}
                />
                <Button onClick={onComplete}>Next</Button>
            </Group>
        </Box>
    );
};
