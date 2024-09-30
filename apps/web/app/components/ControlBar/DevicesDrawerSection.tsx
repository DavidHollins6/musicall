import { NativeSelect, Stack } from "@mantine/core";
import { useDeviceStore } from "../../store/deviceStore";
import { useMidiStore } from "../../store/midiStore";
import { useCameraState } from "../../hooks/useCameraState";
import { useMicrophoneState } from "../../hooks/useMicrophoneState";

export const DevicesDrawerSection: React.FC = () => {
    const { midiInputs } = useMidiStore();
    const { devices: videoDevices, select: selectVideo } = useCameraState();
    const { devices: voiceDevices, select: selectVoice } = useMicrophoneState();
    const { setMidiDeviceId } = useDeviceStore();

    return (
        <Stack pt={16}>
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
                    setMidiDeviceId(e.target.value);
                }}
                label="MIDI"
                data={midiInputs.map((m) => ({ label: m.name, value: m.id }))}
            />
        </Stack>
    );
};
