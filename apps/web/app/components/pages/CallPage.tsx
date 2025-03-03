"use client";

import { VideoGrid } from "../Video/VideoGrid";
import { Box, Flex, rem, useMantineTheme } from "@mantine/core";
import { ControlBar } from "../ControlBar";
import { FullWidthLoader } from "../Loader";
import { Call } from "../Call";
import { midiActor, useMidiStateMachine } from "../../machines/midiMachine.client";
import { useEffect, useState } from "react";
import { useVoiceStateMachine, voiceActor } from "../../machines/voiceMachine";
import { useVideoStateMachine, videoActor } from "../../machines/videoMachine";
import { peerActor } from "../../machines/peerMachine";
import { streamActor, useStreamStateMachine } from "../../machines/streamMachine";
import { chatActor } from "../../machines/chatMachine";
import { socketActor } from "../../machines/socketStateMachine";
import { EnableAudioSplash } from "../audio/EnableAudioSplash";
import { soundActor } from "../../machines/soundMachine.client";

type Props = {
    roomId: string;
    socketUrl?: string;
    device: "Mobile" | "Tablet" | "Desktop" | null;
};

export default function CallPage({ roomId, socketUrl, device }: Props) {
    const theme = useMantineTheme();
    const [audioEnabled, setAudioEnabled] = useState(device !== "Mobile");

    const midiStateMachine = useMidiStateMachine();
    const voiceStateMachine = useVoiceStateMachine();
    const videoStateMachine = useVideoStateMachine();
    const streamStateMachine = useStreamStateMachine();

    useEffect(() => {
        streamActor.start();
        midiActor.start();
        soundActor.start();
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

    if (!audioEnabled) {
        return <EnableAudioSplash onEnable={() => setAudioEnabled(true)} />;
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
