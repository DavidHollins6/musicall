import React from "react";
import { ActionIcon, Drawer, Group, Indicator } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconMicrophone,
    IconMicrophoneOff,
    IconVideo,
    IconVideoOff,
    IconMusic,
    IconMusicOff,
    IconMessageCircle,
    IconUsers,
} from "@tabler/icons-react";
import { ChatDrawerSection } from "./ChatDrawerSection";
import { SettingsPopover } from "./SettingsPopover";
import { ParticipantsDrawer } from "./ParticipantsDrawer";
import { createServerMessage } from "@musicall/types/serverMessage";
import { usePeerStore } from "../../store/peerStore";
import { useSocketStore } from "../../store/socketStore";
import { useUserStore } from "../../store/userStore";
import { useCameraState } from "../../hooks/useCameraState";
import { useMicrophoneState } from "../../hooks/useMicrophoneState";
import { useMidiState } from "../../hooks/useMidiState";

export const ControlBar: React.FC = () => {
    const { socket } = useSocketStore();
    const [chatOpened, { open: openChatDrawer, close: closeChatDrawer }] = useDisclosure(false);
    const [participantsOpened, { open: openParticipantsDrawer, close: closeParticipantsDrawer }] = useDisclosure(false);
    const { waitingList, localStream } = usePeerStore();
    const { isOwner } = useUserStore();
    const { camera } = useCameraState();
    const { microphone } = useMicrophoneState();
    const { midi } = useMidiState();

    return (
        <>
            <Drawer
                styles={{ body: { height: "calc(100% - 60px)" } }}
                opened={chatOpened}
                onClose={closeChatDrawer}
                title="Chat"
                position="right"
            >
                <ChatDrawerSection />
            </Drawer>
            <Drawer
                styles={{ body: { height: "calc(100% - 60px)" } }}
                opened={participantsOpened}
                onClose={closeParticipantsDrawer}
                position="right"
            >
                <ParticipantsDrawer />
            </Drawer>
            <Group h="100%" w="100%" align="center" justify="space-between">
                <Group gap={24}>
                    <ActionIcon.Group>
                        <ActionIcon
                            onClick={() => {
                                const message = createServerMessage({
                                    type: "update-device-status",
                                    midi: midi.isMute,
                                    voice: !microphone.isMute,
                                    video: camera.isMute,
                                });
                                if (socket) {
                                    socket.send(message);
                                }

                                localStream?.getAudioTracks().forEach((track) => (track.enabled = microphone.isMute));

                                microphone.toggle();
                            }}
                            size={48}
                            bg={microphone.isMute ? "red" : "blue"}
                        >
                            {microphone.isMute ? <IconMicrophoneOff /> : <IconMicrophone />}
                        </ActionIcon>
                        <ActionIcon
                            onClick={() => {
                                const message = createServerMessage({
                                    type: "update-device-status",
                                    midi: midi.isMute,
                                    voice: microphone.isMute,
                                    video: !camera.isMute,
                                });
                                if (socket) {
                                    socket.send(message);
                                }

                                localStream?.getVideoTracks().forEach((track) => (track.enabled = camera.isMute));

                                camera.toggle();
                            }}
                            size={48}
                            bg={camera.isMute ? "red" : "blue"}
                        >
                            {camera.isMute ? <IconVideoOff /> : <IconVideo />}
                        </ActionIcon>

                        <ActionIcon
                            onClick={() => {
                                const message = createServerMessage({
                                    type: "update-device-status",
                                    midi: !midi.isMute,
                                    voice: microphone.isMute,
                                    video: camera.isMute,
                                });
                                if (socket) {
                                    socket.send(message);
                                }
                                midi.toggle();
                            }}
                            size={48}
                            bg={midi.isMute ? "red" : "blue"}
                        >
                            {midi.isMute ? <IconMusicOff /> : <IconMusic />}
                        </ActionIcon>
                    </ActionIcon.Group>
                    <SettingsPopover />
                </Group>

                <Group>
                    <ActionIcon onClick={openChatDrawer} size={48} variant="default">
                        <IconMessageCircle size={20} />
                    </ActionIcon>
                    <Indicator label={isOwner ? waitingList.length : 0} disabled={!isOwner || waitingList.length === 0}>
                        <ActionIcon onClick={openParticipantsDrawer} size={48} variant="default">
                            <IconUsers size={20} />
                        </ActionIcon>
                    </Indicator>
                </Group>
            </Group>
        </>
    );
};
