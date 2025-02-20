"use client";
import { Button, Box, Group, LoadingOverlay, NativeSelect, Progress, Stack, useMatches } from "@mantine/core";
import { useMicVolume } from "../../hooks/useMicVolume";
import { useVoiceStateMachine, voiceActor } from "../../machines/voiceMachine";

export const MicrophoneSetup = ({ onComplete }: { onComplete: () => void }) => {
    const voiceStateMachine = useVoiceStateMachine();
    const { audioLevel } = useMicVolume(voiceStateMachine.context.stream, 50);
    const inputsGrow = useMatches({
        base: true,
        lg: false,
    });

    voiceStateMachine.context.stream?.getAudioTracks().forEach((at) => (at.enabled = true));

    return (
        <Box pos="relative" h="100%">
            <Stack justify="center" style={{ height: "calc(100% - 78px)" }} pos="relative">
                Volume:
                <Progress value={audioLevel} />
            </Stack>
            <LoadingOverlay
                visible={voiceStateMachine.value === "initializing"}
                zIndex={1000}
                overlayProps={{ blur: 2 }}
                loaderProps={{
                    children: (
                        <Button
                            onClick={async () => {
                                voiceActor.start();
                                voiceStateMachine.send({ type: "voice.toggle", enabled: true });
                            }}
                        >
                            Request Access to Microphone
                        </Button>
                    ),
                }}
            />
            <Group h="78px" grow={inputsGrow} justify="space-between" align="flex-end">
                <NativeSelect
                    onChange={async (e) => {
                        const newDevice = voiceStateMachine.context.availableDevices.find(
                            (d) => d.deviceId === e.currentTarget.value,
                        );
                        if (newDevice) {
                            voiceStateMachine.send({ type: "voice.setDevice", device: newDevice });
                        }
                    }}
                    label="Microphone"
                    data={voiceStateMachine.context.availableDevices.map((m) => ({
                        label: m.label,
                        value: m.deviceId,
                    }))}
                />
                <Button onClick={onComplete}>Next</Button>
            </Group>
        </Box>
    );
};
