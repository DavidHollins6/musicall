import { ActionIcon, NativeSelect, Popover, Stack } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Input } from "webmidi";
import { useCamera } from "../../hooks/useCamera";
import { useMicrophone } from "../../hooks/useMicrophone";
import { useMidi } from "../../hooks/useMidi";
import { useDeviceStore } from "../../store/deviceStore";

export const SettingsPopover: React.FC = () => {
    const [videoDevices, setVideoDevices] = useState<Array<MediaDeviceInfo>>([]);
    const [audioDevices, setAudioDevices] = useState<Array<MediaDeviceInfo>>([]);
    const [midiInstruments, setMidiInstruments] = useState<Array<Input>>([]);
    const { getVideoDevices } = useCamera();
    const { getAudioDevices } = useMicrophone();
    const { getMidiInstruments } = useMidi();
    const { setVideoDeviceId, setAudioDeviceId, setMidiDeviceId, midi } = useDeviceStore();

    useEffect(() => {
        const initializeData = async () => {
            const newVideoDevices = await getVideoDevices();
            setVideoDevices(newVideoDevices);

            const newAudioDevices = await getAudioDevices();
            setAudioDevices(newAudioDevices);

            const midiInstruments = await getMidiInstruments();
            setMidiInstruments(midiInstruments);

            if (!midi.id && midiInstruments.length > 0) {
                console.log(midi, midiInstruments);
                setMidiDeviceId(midiInstruments[0].id);
            }
        };

        initializeData();
    }, []);

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
                        data={midiInstruments.map((m) => ({ label: m.name, value: m.id }))}
                    />
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
};
