import { useEffect } from "react";
import { useThrottledState } from "@mantine/hooks";
import { createSoundDetector } from "@stream-io/video-react-sdk";
import { useEffectEvent } from "./useEffectEvent";
import { useMicrophoneState } from "./useMicrophoneState";

export const useMicVolume = () => {
    const { microphone, mediaStream } = useMicrophoneState();
    const [audioLevel, setAudioLevel] = useThrottledState(0, 500);

    const onAudioLevel = useEffectEvent(({ audioLevel: al }: { audioLevel: number }) => {
        setAudioLevel(al);
    });

    useEffect(() => {
        if (!microphone.isMute && mediaStream) {
            const disposeSoundDetector = createSoundDetector(mediaStream, onAudioLevel, {
                detectionFrequencyInMs: 80,
                destroyStreamOnStop: false,
            });

            return () => {
                disposeSoundDetector().catch(console.error);
            };
        }
    }, [mediaStream, microphone.isMute]);

    return { audioLevel };
};
