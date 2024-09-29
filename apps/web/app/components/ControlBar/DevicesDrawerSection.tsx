import { NativeSelect, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { useCamera } from "../../hooks/useCamera";
import { useMicrophone } from "../../hooks/useMicrophone";
import { useDeviceStore } from "../../store/deviceStore";
import { useMidiStore } from "../../store/midiStore";

export const DevicesDrawerSection: React.FC = () => {
    const [videoDevices, setVideoDevices] = useState<Array<MediaDeviceInfo>>([]);
    const [audioDevices, setAudioDevices] = useState<Array<MediaDeviceInfo>>([]);
    const { midiInputs } = useMidiStore();
    const { getVideoDevices } = useCamera();
    const { getAudioDevices } = useMicrophone();
    const { setVideoDeviceId, setAudioDeviceId, setMidiDeviceId } = useDeviceStore();

    useEffect(() => {
        const initializeData = async () => {
            const newVideoDevices = await getVideoDevices();
            setVideoDevices(newVideoDevices);

            const newAudioDevices = await getAudioDevices();
            setAudioDevices(newAudioDevices);
        };

        initializeData();
    }, []);

    return (
        <Stack pt={16}>
            <NativeSelect
                size="sm"
                onChange={async (e) => {
                    setVideoDeviceId(e.target.value);
                }}
                label="Video"
                data={videoDevices.map((m) => ({ label: m.label, value: m.deviceId }))}
            />
            <NativeSelect
                size="sm"
                onChange={async (e) => {
                    setAudioDeviceId(e.target.value);
                }}
                label="Microphone"
                data={audioDevices.map((m) => ({ label: m.label, value: m.deviceId }))}
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
