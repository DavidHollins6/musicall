import { useEffect } from "react";
import { useDeviceStore } from "../store/deviceStore";
import { WebMidi } from "webmidi";

export const useMidiState = () => {
    const { midi, setMidiDeviceId, setNewMidi, toggleMidi, setMidiDevices } = useDeviceStore();

    const getDevices = () => {
        return WebMidi.inputs;
    };

    useEffect(() => {
        const newDevices = getDevices();
        setMidiDeviceId(newDevices[0].id);
    }, []);

    return {
        midi: {
            toggle: () => {
                toggleMidi();
            },
            enable: () => {
                if (!midi.enabled) {
                    toggleMidi();
                }
            },
            disable: () => {
                if (midi.enabled) {
                    toggleMidi();
                }
            },
            isMute: !midi.enabled,
        },
        selectedDevice: midi.id,
        devices: midi.devices,
        select: async (id: string) => {
            setNewMidi(id);
        },
        hasBrowserPermission: false,
        defaultMidiDevice: null,
        defaultMidiOn: false,
        refreshDevices: async () => {
            setMidiDevices(getDevices());
        },
    };
};
