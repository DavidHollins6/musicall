import { Box, Button, Group, LoadingOverlay, NativeSelect, useMatches } from "@mantine/core";
import { midiActor, useMidiStateMachine } from "../../machines/midiMachine";

export const MidiSetup = ({ onComplete }: { onComplete: () => void }) => {
    const midiStateMachine = useMidiStateMachine();
    const inputsGrow = useMatches({
        base: true,
        lg: false,
    });

    return (
        <Box pos="relative" h="100%">
            <Box style={{ height: "calc(100% - 78px)" }} pos="relative"></Box>
            <LoadingOverlay
                visible={midiStateMachine.value === "initializing"}
                zIndex={1000}
                overlayProps={{ blur: 2 }}
                loaderProps={{
                    children: (
                        <Button
                            onClick={async () => {
                                midiActor.start();
                                midiStateMachine.send({ type: "midi.toggle", enabled: true });
                                midiStateMachine.send({ type: "midi.setInstrument", instrument: "drums" });
                            }}
                        >
                            Request Access to Instruments
                        </Button>
                    ),
                }}
            />
            <Group h="78px" grow={inputsGrow} justify="space-between" align="flex-end">
                <NativeSelect
                    onChange={async (e) => {
                        const newInput = midiStateMachine.context.inputs.find((i) => i.id === e.currentTarget.value);

                        if (newInput) {
                            midiStateMachine.send({ type: "midi.selectMidiInput", selectedInput: newInput });
                        }
                    }}
                    label="Instrument"
                    value={midiStateMachine.context.selectedInput?.id}
                    data={midiStateMachine.context.inputs.map((m) => ({ label: m.name, value: m.id }))}
                />
                <Button onClick={onComplete}>Next</Button>
            </Group>
        </Box>
    );
};
