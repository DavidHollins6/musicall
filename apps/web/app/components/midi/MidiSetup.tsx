import { Box, Button, Group, LoadingOverlay, NativeSelect } from "@mantine/core";
import { useState } from "react";
import { useMidiStore } from "../../store/midiStore";
import { WebMidi } from "webmidi";
import { useDeviceStore } from "../../store/deviceStore";
import { useMidiSoundPlayer } from "../../hooks/useMidiSoundPlayer";

export const MidiSetup = ({ onComplete }: { onComplete: () => void }) => {
    const [requestedAccess, setRequestedAccess] = useState(false);
    const { midiInputs, refreshMidiInputs } = useMidiStore();
    const { setMidiDeviceId, midi } = useDeviceStore();
    useMidiSoundPlayer();

    return (
        <Box pos="relative" h="100%">
            <Box style={{ height: "calc(100% - 78px)" }} pos="relative"></Box>
            <LoadingOverlay
                visible={!requestedAccess}
                zIndex={1000}
                overlayProps={{ blur: 2 }}
                loaderProps={{
                    children: (
                        <Button
                            onClick={async () => {
                                await WebMidi.enable();
                                refreshMidiInputs();
                                setMidiDeviceId(WebMidi.inputs[0].id);
                                setRequestedAccess(true);
                            }}
                        >
                            Request Access to Instruments
                        </Button>
                    ),
                }}
            />
            <Group h="78px" justify="space-between" align="flex-end">
                <NativeSelect
                    onChange={async (e) => {
                        setMidiDeviceId(e.currentTarget.value);
                    }}
                    label="Instrument"
                    value={midi.id}
                    data={midiInputs?.map((m) => ({ label: m.name, value: m.id }))}
                />
                <Button onClick={onComplete}>Next</Button>
            </Group>
        </Box>
    );
};
