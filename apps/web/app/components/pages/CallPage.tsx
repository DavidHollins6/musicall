import { VideoGrid } from "../Video/VideoGrid";
import { Box, Flex, rem, useMantineTheme } from "@mantine/core";
import { ControlBar } from "../ControlBar";
import { useEffect, useState } from "react";
import { WebMidi } from "webmidi";
import { FullWidthLoader } from "../Loader";
import { Call } from "../Call";
import { useCameraState } from "../../hooks/useCameraState";
import { useMicrophoneState } from "../../hooks/useMicrophoneState";

type Props = {
    roomId: string;
};

export default function CallPage({ roomId }: Props) {
    const [askedPermissions, setAskedPermissions] = useState(false);
    const { refreshDevices: refreshVideoDevices } = useCameraState();
    const { refreshDevices: refreshVoiceDevices } = useMicrophoneState();

    const theme = useMantineTheme();

    const askForPermissions = async () => {
        try {
            await WebMidi.enable();
        } catch (e) {
            console.log("Declined MIDI", e);
        }

        try {
            await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            refreshVideoDevices();
            refreshVoiceDevices();
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
            <Call roomId={roomId}>
                <VideoGrid />
                <Box
                    style={{ borderTop: `2px solid ${theme.colors.gray[2]}`, boxShadow: theme.shadows.lg }}
                    px={16}
                    h={rem("64px")}
                >
                    <ControlBar />
                </Box>
            </Call>
        </Flex>
    );
}
