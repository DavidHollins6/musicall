export const useMicrophone = () => {
    return {
        getStreamById: async (id: string) => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        deviceId: id,
                    },
                });

                return stream;
            } catch (e) {
                console.error(e);
                return null;
            }
        },
        getAudioDevices: async () => {
            const audioDevices = await navigator.mediaDevices.enumerateDevices();

            return audioDevices.filter((device) => device.kind === "audioinput");
        },
        checkPermissions: async () => {
            const permissions = await navigator.permissions.query({ name: "microphone" as PermissionName });
            return permissions.state === "granted";
        },
    };
};
