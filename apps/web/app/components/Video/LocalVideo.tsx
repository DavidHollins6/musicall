"use client";

/* eslint-disable jsx-a11y/media-has-caption */
import React from "react";
import { Video } from ".";
import { Flex, Group, Text } from "@mantine/core";
import { IconMicrophoneOff } from "@tabler/icons-react";
import { useUserStore } from "../../store/userStore";
import { useVoiceStateMachine } from "../../machines/voiceMachine";
import { useVideoStateMachine } from "../../machines/videoMachine";
import { useStreamStateMachine } from "../../machines/streamMachine";

export const LocalVideo: React.FC = () => {
    const { user } = useUserStore();
    const voiceStateMachine = useVoiceStateMachine();
    const videoStateMachine = useVideoStateMachine();
    const streamMachine = useStreamStateMachine();

    return (
        <Flex
            w="100%"
            h="100%"
            pos="relative"
            justify="center"
            align="center"
            // className={audioLevel > 30 ? classes.talking : ""}
        >
            {/* <Avatar w="100%" h="100%" radius="xl" /> */}
            {videoStateMachine.context.enabled ? <Video muted stream={streamMachine.context.stream} /> : null}
            <Group
                gap={4}
                p={4}
                pos="absolute"
                bottom={0}
                right={0}
                style={{ borderTopLeftRadius: "4px" }}
                bg="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
            >
                {voiceStateMachine.context.enabled ? null : <IconMicrophoneOff size={16} color="red" />}
                <Text color="white">{user.name} (You)</Text>
            </Group>
        </Flex>
    );
};
