import { useEffect } from "react";
import { useDeviceStore } from "../store/deviceStore";

export const useMicrophoneState = () => {
    const { voice, toggleVoice, setVoiceDevices, setNewVoice } = useDeviceStore();

    const getDevices = async () => {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        return allDevices.filter((d) => d.kind === "audioinput");
    };

    useEffect(() => {
        getDevices().then((d) => setVoiceDevices(d));
    }, []);

    return {
        microphone: {
            toggle: () => {
                voice.stream?.getAudioTracks().forEach((track) => (track.enabled = !voice.enabled));
                toggleVoice();
            },
            enable: () => {
                if (!voice.enabled) {
                    voice.stream?.getAudioTracks().forEach((track) => (track.enabled = !voice.enabled));
                    toggleVoice();
                }
            },
            disable: () => {
                if (voice.enabled) {
                    voice.stream?.getAudioTracks().forEach((track) => (track.enabled = !voice.enabled));
                    toggleVoice();
                }
            },
            isMute: !voice.enabled,
        },
        selectedDevice: voice.id,
        devices: voice.devices,
        select: async (id: string) => {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    deviceId: id,
                },
            });
            setNewVoice(stream, id);
        },
        hasBrowserPermission: false,
        mediaStream: voice.stream,
        defaultMicrophoneDevice: null,
        defaultMicrophoneOn: false,
        refreshDevices: async () => {
            setVoiceDevices(await getDevices());
        },
        setDevices: (devices: Array<MediaDeviceInfo>) => {
            setVoiceDevices(devices);
        },
    };
};
