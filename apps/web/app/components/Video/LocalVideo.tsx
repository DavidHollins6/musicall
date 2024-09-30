/* eslint-disable jsx-a11y/media-has-caption */
import React from "react";
import { Video } from ".";
import { Flex, Group, Text } from "@mantine/core";
import { IconMicrophoneOff } from "@tabler/icons-react";
import { usePeerStore } from "../../store/peerStore";
import { useUserStore } from "../../store/userStore";
import classes from "./video.module.css";
import { useMicVolume } from "../../hooks/useMicVolume";
import { useCameraState } from "../../hooks/useCameraState";
import { useMicrophoneState } from "../../hooks/useMicrophoneState";

export const LocalVideo: React.FC = () => {
    const { user } = useUserStore();
    const { localStream } = usePeerStore();
    const { camera } = useCameraState();
    const { microphone, mediaStream } = useMicrophoneState();
    const { audioLevel } = useMicVolume(mediaStream);
    console.log(audioLevel);

    return (
        <Flex
            w="100%"
            h="100%"
            pos="relative"
            justify="center"
            align="center"
            className={audioLevel > 30 ? classes.talking : ""}
        >
            {/* <Avatar w="100%" h="100%" radius="xl" /> */}
            {camera.isMute ? null : <Video muted stream={localStream} />}
            <Group
                gap={4}
                p={4}
                pos="absolute"
                bottom={0}
                right={0}
                style={{ borderTopLeftRadius: "4px" }}
                bg="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
            >
                {!microphone.isMute ? null : <IconMicrophoneOff size={16} color="red" />}
                <Text color="white">{user.name} (You)</Text>
            </Group>
        </Flex>
    );
};
