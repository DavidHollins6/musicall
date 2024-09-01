import { useEffect } from "react";
import { useDevice } from "~/store/deviceContext";
import { usePeers } from "~/store/peersContext";

export const useDeviceListener = () => {
    const { video, voice } = useDevice();
    const { localStream } = usePeers();

    useEffect(() => {
        localStream?.getVideoTracks().forEach((track) => (track.enabled = video.enabled));
    }, [video.enabled]);

    useEffect(() => {
        localStream?.getAudioTracks().forEach((track) => {
            track.enabled = voice.enabled;
        });
    }, [voice.enabled]);
};
