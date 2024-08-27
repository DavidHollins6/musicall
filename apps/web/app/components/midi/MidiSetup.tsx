import { Box, Button, Center, Group, LoadingOverlay, NativeSelect, Text } from "@mantine/core";
import midimessage from "midimessage";
import { useState } from "react";
import { useMidiListener } from "../../hooks/useMidiListener";
import { noteMidiToString } from "../../utils/sound/noteMidiToString";
import { useMidi } from "../../hooks/useMidi";
import { Input } from "webmidi";

export const MidiSetup = ({ onComplete }: { onComplete: () => void }) => {
    const [selectedMidiInput, setSelectedMidiInput] = useState("");
    const [lastHitNote, setLastHitNote] = useState<string>("...");
    const [requestedAccess, setRequestedAccess] = useState(false);
    const [midiInstruments, setMidiInstruments] = useState<Array<Input>>([]);

    const { getMidiInstruments } = useMidi();

    useMidiListener(selectedMidiInput, (event) => {
        const message = midimessage(event);
        if (message.messageType === "noteon") {
            console.log(message);
            setLastHitNote(noteMidiToString(message.key));
        }
    });

    return (
        <Box pos="relative" h="100%">
            <Box style={{ height: "calc(100% - 78px)" }} pos="relative">
                <Center h="100%">
                    <Text style={{ fontSize: "124px" }}>{lastHitNote}</Text>
                </Center>
            </Box>
            <LoadingOverlay
                visible={!requestedAccess}
                zIndex={1000}
                overlayProps={{ blur: 2 }}
                loaderProps={{
                    children: (
                        <Button
                            onClick={async () => {
                                const newMidiInstruments = await getMidiInstruments();
                                setMidiInstruments(newMidiInstruments);
                                setSelectedMidiInput(newMidiInstruments[0].id);
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
                        setSelectedMidiInput(e.currentTarget.value);
                    }}
                    label="Instrument"
                    value={selectedMidiInput}
                    data={midiInstruments?.map((m) => ({ label: m.name, value: m.id }))}
                />
                <Button onClick={onComplete}>Next</Button>
            </Group>
        </Box>
    );
};
