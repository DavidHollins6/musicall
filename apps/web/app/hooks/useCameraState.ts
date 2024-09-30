import { useEffect } from "react";
import { useDeviceStore } from "../store/deviceStore";

export const useCameraState = () => {
    const { video, toggleVideo, setVideoDevices, setNewVideo } = useDeviceStore();

    const getDevices = async () => {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        return allDevices.filter((d) => d.kind === "videoinput");
    };

    useEffect(() => {
        getDevices().then((d) => setVideoDevices(d));
    }, []);

    return {
        camera: {
            toggle: () => {
                video.stream?.getVideoTracks().forEach((track) => (track.enabled = !video.enabled));

                toggleVideo();
            },
            enable: () => {
                if (!video.enabled) {
                    video.stream?.getVideoTracks().forEach((track) => (track.enabled = !video.enabled));
                    toggleVideo();
                }
            },
            disable: () => {
                if (video.enabled) {
                    video.stream?.getVideoTracks().forEach((track) => (track.enabled = !video.enabled));
                    toggleVideo();
                }
            },
            isMute: !video.enabled,
        },
        selectedDevice: video.id,
        devices: video.devices,
        select: async (id: string) => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: id,
                },
            });
            setNewVideo(stream, id);
        },
        hasBrowserPermission: false,
        mediaStream: video.stream,
        defaultCameraDevice: null,
        defaultCameraOn: false,
        refreshDevices: async () => {
            setVideoDevices(await getDevices());
        },
    };
};
