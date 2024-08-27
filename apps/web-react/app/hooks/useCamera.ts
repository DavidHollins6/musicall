import { useState } from "react";

export const useCamera = () => {
    const [videoDevices, setVideoDevices] = useState<Array<MediaDeviceInfo>>([]);

    return {
        getStream: async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { min: 640, ideal: 1920, max: 1920 },
                        height: { min: 480, ideal: 1080, max: 1080 },
                    },
                });

                const newDevices = await navigator.mediaDevices.enumerateDevices();
                setVideoDevices(newDevices.filter((device) => device.kind === "videoinput"));

                return stream;
            } catch (e) {
                console.error(e);
                return null;
            }
        },
        videoDevices,
    };
};
