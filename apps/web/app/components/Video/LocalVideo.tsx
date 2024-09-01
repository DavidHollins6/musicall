/* eslint-disable jsx-a11y/media-has-caption */
import React from "react";
import { usePeers } from "../../store/peersContext";
import { Video } from ".";
import { Avatar, Flex, Group, Text } from "@mantine/core";
import { IconMicrophoneOff } from "@tabler/icons-react";
import { useDevice } from "../../store/deviceContext";
import { User } from "@musicall/storage/types";

export const LocalVideo: React.FC<{ user: User }> = ({ user }: { user: User }) => {
    const { localStream } = usePeers();
    const { voice, video } = useDevice();

    return (
        <Flex w="100%" h="100%" pos="relative" justify="center" align="center">
            {/* <Avatar w="100%" h="100%" radius="xl" /> */}
            {video.enabled ? <Video muted stream={localStream} /> : null}
            <Group
                gap={4}
                p={4}
                pos="absolute"
                bottom={0}
                right={0}
                style={{ borderTopLeftRadius: "4px" }}
                bg="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
            >
                {!voice.enabled ? <IconMicrophoneOff size={16} color="red" /> : null}
                <Text color="white">{user.name} (You)</Text>
            </Group>
        </Flex>
    );
};
