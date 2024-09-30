import { useEffect } from "react";
import { useThrottledState } from "@mantine/hooks";
import { createSoundDetector } from "@stream-io/video-react-sdk";
import { useEffectEvent } from "./useEffectEvent";
import { useMicrophoneState } from "./useMicrophoneState";

export const useMicVolume = (stream?: MediaStream, throttleAmount?: number) => {
    const { microphone } = useMicrophoneState();
    const [audioLevel, setAudioLevel] = useThrottledState(0, throttleAmount || 500);

    const onAudioLevel = useEffectEvent(({ audioLevel: al }: { audioLevel: number }) => {
        setAudioLevel(al);
    });

    useEffect(() => {
        if (!microphone.isMute && stream) {
            const disposeSoundDetector = createSoundDetector(stream, onAudioLevel, {
                detectionFrequencyInMs: 80,
                destroyStreamOnStop: false,
            });

            return () => {
                disposeSoundDetector().catch(console.error);
            };
        }
    }, [stream, microphone.isMute]);

    return { audioLevel };
};
