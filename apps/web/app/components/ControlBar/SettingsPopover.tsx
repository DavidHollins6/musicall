"use client";

import { ActionIcon, NativeSelect, Popover, Stack } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { WebMidi } from "webmidi";
import { Instrument } from "@musicall/types/Instrument";
import { useMidiStateMachine } from "../../machines/midiMachine.client";
import { useVideoStateMachine } from "../../machines/videoMachine";
import { useVoiceStateMachine } from "../../machines/voiceMachine";

export const SettingsPopover: React.FC = () => {
    const videoStateMachine = useVideoStateMachine();
    const voiceStateMachine = useVoiceStateMachine();
    const midiStateMachine = useMidiStateMachine();

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
                            const newDevice = videoStateMachine.context.availableDevices.find(
                                (d) => d.deviceId === e.target.value,
                            );
                            if (newDevice) {
                                videoStateMachine.send({ type: "video.setDevice", device: newDevice });
                            }
                        }}
                        label="Video"
                        data={videoStateMachine.context.availableDevices.map((m) => ({
                            label: m.label,
                            value: m.deviceId,
                        }))}
                    />
                    <NativeSelect
                        size="sm"
                        onChange={async (e) => {
                            const newDevice = voiceStateMachine.context.availableDevices.find(
                                (d) => d.deviceId === e.target.value,
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
                    <NativeSelect
                        size="sm"
                        onChange={async (e) => {
                            const newInput = WebMidi.inputs.find((i) => i.id === e.target.value);
                            if (newInput) {
                                midiStateMachine.send({ type: "midi.selectMidiInput", selectedInput: newInput });
                            }
                        }}
                        label="MIDI"
                        data={midiStateMachine.context.inputs.map((m) => ({ label: m.name, value: m.id }))}
                    />
                    <NativeSelect
                        size="sm"
                        onChange={async (e) => {
                            midiStateMachine.send({
                                type: "midi.setInstrument",
                                instrument: e.target.value as Instrument,
                            });
                        }}
                        defaultValue={midiStateMachine.context.instrument}
                        label="Instrument"
                        data={[
                            { label: "Drums", value: "drums" },
                            { label: "Keyboard", value: "keyboard" },
                        ]}
                    />
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
};
