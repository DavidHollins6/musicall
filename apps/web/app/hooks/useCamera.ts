export const useCamera = () => {
    return {
        getDefaultId: async () => {
            //TODO: We could fetch from settings here
            const videoDevices = (await navigator.mediaDevices.enumerateDevices()).filter(
                (device) => device.kind === "videoinput",
            );

            if (videoDevices.length > 0) {
                const id = videoDevices[0].deviceId;

                await navigator.mediaDevices.getUserMedia({
                    video: {
                        deviceId: id,
                    },
                });

                return id;
            }

            return null;
        },
        getStreamById: async (id: string) => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        deviceId: id,
                    },
                });

                return stream;
            } catch (e) {
                console.error(e);
                return null;
            }
        },
        getVideoDevices: async () => {
            const videoDevices = await navigator.mediaDevices.enumerateDevices();

            return videoDevices.filter((device) => device.kind === "videoinput");
        },
    };
};
