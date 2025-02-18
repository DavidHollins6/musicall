import { useEffect } from "react";
import { useThrottledState } from "@mantine/hooks";
import { createSoundDetector } from "@stream-io/video-react-sdk";
import { useEffectEvent } from "./useEffectEvent";
import { useVoiceStateMachine } from "../machines/voiceMachine";

export const useMicVolume = (stream?: MediaStream, throttleAmount?: number) => {
    const voiceStateMachine = useVoiceStateMachine();
    const [audioLevel, setAudioLevel] = useThrottledState(0, throttleAmount || 500);

    const onAudioLevel = useEffectEvent(({ audioLevel: al }: { audioLevel: number }) => {
        setAudioLevel(al);
    });

    useEffect(() => {
        if (voiceStateMachine.context.enabled && stream) {
            const disposeSoundDetector = createSoundDetector(stream, onAudioLevel, {
                detectionFrequencyInMs: 80,
                destroyStreamOnStop: false,
            });

            return () => {
                disposeSoundDetector().catch(console.error);
            };
        }
    }, [stream, voiceStateMachine.context.enabled, voiceStateMachine.context.device?.deviceId]);

    return { audioLevel };
};
