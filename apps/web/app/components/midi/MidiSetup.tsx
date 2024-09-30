import { Box, Button, Group, LoadingOverlay, NativeSelect } from "@mantine/core";
import { useState } from "react";
import { WebMidi } from "webmidi";
import { useMidiSoundPlayer } from "../../hooks/useMidiSoundPlayer";
import { useMidiState } from "../../hooks/useMidiState";

export const MidiSetup = ({ onComplete }: { onComplete: () => void }) => {
    const [requestedAccess, setRequestedAccess] = useState(false);
    const { select, devices, selectedDevice, refreshDevices } = useMidiState();
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
                                refreshDevices();
                                select(WebMidi.inputs[0].id);
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
                        select(e.currentTarget.value);
                    }}
                    label="Instrument"
                    value={selectedDevice}
                    data={devices?.map((m) => ({ label: m.name, value: m.id }))}
                />
                <Button onClick={onComplete}>Next</Button>
            </Group>
        </Box>
    );
};
