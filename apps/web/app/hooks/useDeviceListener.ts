import { useEffect } from "react";
import { useDeviceStore } from "../store/deviceStore";
import { usePeerStore } from "../store/peerStore";

export const useDeviceListener = () => {
    const { video, voice } = useDeviceStore();
    const { localStream } = usePeerStore();

    useEffect(() => {
        localStream?.getVideoTracks().forEach((track) => (track.enabled = video.enabled));
    }, [video.enabled]);

    useEffect(() => {
        localStream?.getAudioTracks().forEach((track) => {
            track.enabled = voice.enabled;
        });
    }, [voice.enabled]);
};
