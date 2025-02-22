"use client";

import { VideoGrid } from "../Video/VideoGrid";
import { Box, Flex, rem, useMantineTheme } from "@mantine/core";
import { ControlBar } from "../ControlBar";
import { FullWidthLoader } from "../Loader";
import { Call } from "../Call";
import { midiActor, useMidiStateMachine } from "../../machines/midiMachine.client";
import { useEffect } from "react";
import { useVoiceStateMachine, voiceActor } from "../../machines/voiceMachine";
import { useVideoStateMachine, videoActor } from "../../machines/videoMachine";
import { peerActor } from "../../machines/peerMachine";
import { streamActor, useStreamStateMachine } from "../../machines/streamMachine";
import { chatActor } from "../../machines/chatMachine";
import { socketActor } from "../../machines/socketStateMachine";

type Props = {
    roomId: string;
    socketUrl?: string;
};

export default function CallPage({ roomId, socketUrl }: Props) {
    const theme = useMantineTheme();

    const midiStateMachine = useMidiStateMachine();
    const voiceStateMachine = useVoiceStateMachine();
    const videoStateMachine = useVideoStateMachine();
    const streamStateMachine = useStreamStateMachine();

    useEffect(() => {
        streamActor.start();
        midiActor.start();
        midiStateMachine.send({ type: "midi.setType", newType: "peers" });
        voiceActor.start();
        videoActor.start();
        peerActor.start();
        chatActor.start();
        socketActor.start();
    }, []);

    if (midiStateMachine.value === "initializing") {
        return <FullWidthLoader message="Checking Permissions" />;
    }

    if (voiceStateMachine.value === "initializing") {
        return <FullWidthLoader message="Checking Permissions" />;
    }

    if (videoStateMachine.value === "initializing") {
        return <FullWidthLoader message="Checking Permissions" />;
    }

    if (streamStateMachine.value === "disabled") {
        return <FullWidthLoader message="Creating Stream" />;
    }

    return (
        <Flex direction="column" w="100%" h="100%">
            <Call socketUrl={socketUrl} roomId={roomId}>
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
