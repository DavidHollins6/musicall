import { VideoGrid } from "../Video/VideoGrid";
import { Box, Flex, rem, useMantineTheme } from "@mantine/core";
import { ControlBar } from "../ControlBar";
import { useEffect, useState } from "react";
import { WebMidi } from "webmidi";
import { useCamera } from "../../hooks/useCamera";
import { useMicrophone } from "../../hooks/useMicrophone";
import { useDeviceStore } from "../../store/deviceStore";
import { useMidiStore } from "../../store/midiStore";
import { FullWidthLoader } from "../Loader";
import { CallRTC } from "../CallRTC";

type Props = {
    roomId: string;
};

export default function CallPage({ roomId }: Props) {
    const [askedPermissions, setAskedPermissions] = useState(false);
    const { getDefaultId: getVideoDefaultId } = useCamera();
    const { getDefaultId: getAudioDefaultId } = useMicrophone();
    const { setAudioDeviceId, setVideoDeviceId } = useDeviceStore();
    const { refreshMidiInputs } = useMidiStore();

    const theme = useMantineTheme();

    const askForPermissions = async () => {
        try {
            await WebMidi.enable();
            refreshMidiInputs();
        } catch (e) {
            console.log("Declined MIDI", e);
        }

        try {
            await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            const videoDeviceId = await getVideoDefaultId();
            if (videoDeviceId) {
                setVideoDeviceId(videoDeviceId);
            }

            const audioDeviceId = await getAudioDefaultId();
            if (audioDeviceId) {
                setAudioDeviceId(audioDeviceId);
            }
        } catch (e) {
            console.log("Declined Video/Audio");
        }
    };

    useEffect(() => {
        askForPermissions().then(() => {
            setAskedPermissions(true);
        });
    }, []);

    if (!askedPermissions) {
        return <FullWidthLoader />;
    }

    return (
        <Flex direction="column" w="100%" h="100%">
            <CallRTC roomId={roomId} />
            <VideoGrid />
            <Box
                style={{ borderTop: `2px solid ${theme.colors.gray[2]}`, boxShadow: theme.shadows.lg }}
                px={16}
                h={rem("64px")}
            >
                <ControlBar />
            </Box>
        </Flex>
    );
}
