import { useState } from "react";
import { Button, Box, Group, LoadingOverlay, NativeSelect, Card } from "@mantine/core";
import { useMicrophone } from "../../hooks/useMicrophone";
import { Visualizer } from "react-sound-visualizer";

export const MicrophoneSetup = ({ onComplete }: { onComplete: () => void }) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [requestedAccess, setRequestedAccess] = useState(false);
    const [microphoneId, setMicrophoneId] = useState<string | null>(null);
    const [audioDevices, setAudioDevices] = useState<Array<MediaDeviceInfo>>();

    const { getStreamById, getAudioDevices } = useMicrophone();

    return (
        <Box pos="relative" h="100%">
            <Box style={{ height: "calc(100% - 78px)" }} pos="relative">
                <Visualizer key={microphoneId} audio={stream} autoStart>
                    {({ canvasRef }) => (
                        <>
                            <Card
                                h="100%"
                                style={{ display: "flex", alignItems: "center", justifyContent: "center " }}
                                withBorder
                                shadow="xs"
                            >
                                <canvas style={{ width: "100%", maxHeight: "100%" }} ref={canvasRef} />
                            </Card>
                        </>
                    )}
                </Visualizer>
            </Box>
            <LoadingOverlay
                visible={!requestedAccess}
                zIndex={1000}
                overlayProps={{ blur: 2 }}
                loaderProps={{
                    children: (
                        <Button
                            onClick={async () => {
                                const newAudioDevices = await getAudioDevices();
                                setAudioDevices(newAudioDevices);

                                const newStream = await getStreamById(newAudioDevices[0].deviceId);

                                if (!newStream) {
                                    return;
                                }

                                setStream(newStream);
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
                        setMicrophoneId(e.currentTarget.value);
                        const newStream = await getStreamById(e.currentTarget.value);
                        setStream(newStream);
                    }}
                    label="Microphone"
                    data={audioDevices?.map((m) => ({ label: m.label, value: m.deviceId }))}
                />
                <Button onClick={onComplete}>Next</Button>
            </Group>
        </Box>
    );
};
