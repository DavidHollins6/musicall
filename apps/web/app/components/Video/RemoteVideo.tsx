"use client";

/* eslint-disable jsx-a11y/media-has-caption */
import React from "react";
import { Video } from ".";
import { Flex, Group, Text } from "@mantine/core";
import { IconMicrophoneOff } from "@tabler/icons-react";
import classes from "./video.module.css";
import { useMicVolume } from "../../hooks/useMicVolume";
import { usePeerStateMachine } from "../../machines/peerMachine";

type Props = {
    peerId: string;
};

export const RemoteVideo: React.FC<Props> = ({ peerId }) => {
    const peerStateMachine = usePeerStateMachine();
    const peer = peerStateMachine.context.peers[peerId];
    const { audioLevel } = useMicVolume(peer.stream);

    return (
        <Flex
            w="100%"
            h="100%"
            pos="relative"
            justify="center"
            align="center"
            className={audioLevel > 30 ? classes.talking : ""}
        >
            <Video stream={peer.stream} />
            <Group
                gap={4}
                p={4}
                pos="absolute"
                bottom={0}
                right={0}
                style={{ borderTopLeftRadius: "4px" }}
                bg="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
            >
                {!peer.microphoneEnabled ? <IconMicrophoneOff size={16} color="red" /> : null}
                <Text color="white">{peer.user.name}</Text>
            </Group>
        </Flex>
    );
};
