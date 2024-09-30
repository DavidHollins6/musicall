import { ActionIcon, NativeSelect, Popover, Stack } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { useCameraState } from "../../hooks/useCameraState";
import { useMicrophoneState } from "../../hooks/useMicrophoneState";
import { useMidiState } from "../../hooks/useMidiState";

export const SettingsPopover: React.FC = () => {
    const { devices: videoDevices, select: selectVideo } = useCameraState();
    const { devices: voiceDevices, select: selectVoice } = useMicrophoneState();
    const { devices: midiDevices, select: selectMidi } = useMidiState();

    return (
        <Popover width={300} position="top-start" withArrow shadow="md">
            <Popover.Target>
                <ActionIcon size={48} variant="default">
                    <IconSettings size={20} />
                </ActionIcon>
            </Popover.Target>

            <Popover.Dropdown>
                <Stack>
                    <NativeSelect
                        size="sm"
                        onChange={async (e) => {
                            selectVideo(e.target.value);
                        }}
                        label="Video"
                        data={videoDevices.map((m) => ({ label: m.label, value: m.deviceId }))}
                    />
                    <NativeSelect
                        size="sm"
                        onChange={async (e) => {
                            selectVoice(e.target.value);
                        }}
                        label="Microphone"
                        data={voiceDevices.map((m) => ({ label: m.label, value: m.deviceId }))}
                    />
                    <NativeSelect
                        size="sm"
                        onChange={async (e) => {
                            selectMidi(e.target.value);
                        }}
                        label="MIDI"
                        data={midiDevices.map((m) => ({ label: m.name, value: m.id }))}
                    />
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
};
