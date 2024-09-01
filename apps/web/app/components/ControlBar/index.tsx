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
    IconUserPlus,
} from "@tabler/icons-react";
import { ChatDrawerSection } from "./ChatDrawerSection";
import { SettingsPopover } from "./SettingsPopover";
import { WaitingListDrawer } from "./WaitingListDrawer";
import { createServerMessage } from "@musicall/types/serverMessage";
import { useDeviceStore } from "../../store/deviceStore";
import { usePeerStore } from "../../store/peerStore";
import { useSocketStore } from "../../store/socketStore";
import { useUserStore } from "../../store/userStore";

export const ControlBar: React.FC = () => {
    const { socket } = useSocketStore();
    const [chatOpened, { open: openChatDrawer, close: closeChatDrawer }] = useDisclosure(false);
    const [waitingListopened, { open: openWaitingListDrawer, close: closeWaitingListDrawer }] = useDisclosure(false);
    const { video, midi, voice, toggleVoice, toggleVideo, toggleMidi } = useDeviceStore();
    const { waitingList } = usePeerStore();
    const { isOwner } = useUserStore();

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
                opened={waitingListopened}
                onClose={closeWaitingListDrawer}
                title="Waiting List"
                position="right"
            >
                <WaitingListDrawer />
            </Drawer>
            <Group h="100%" w="100%" align="center" justify="space-between">
                <Group gap={24}>
                    <ActionIcon.Group>
                        <ActionIcon
                            onClick={() => {
                                console.log("toggle voice", voice.enabled);
                                const message = createServerMessage({
                                    type: "update-device-status",
                                    midi: midi.enabled,
                                    voice: !voice.enabled,
                                    video: video.enabled,
                                });
                                if (socket) {
                                    socket.send(message);
                                }
                                toggleVoice();
                            }}
                            size={48}
                            bg={voice.enabled ? "blue" : "red"}
                        >
                            {voice.enabled ? <IconMicrophone /> : <IconMicrophoneOff />}
                        </ActionIcon>
                        <ActionIcon
                            onClick={() => {
                                const message = createServerMessage({
                                    type: "update-device-status",
                                    midi: midi.enabled,
                                    voice: voice.enabled,
                                    video: !video.enabled,
                                });
                                if (socket) {
                                    socket.send(message);
                                }
                                toggleVideo();
                            }}
                            size={48}
                            bg={video.enabled ? "blue" : "red"}
                        >
                            {video.enabled ? <IconVideo /> : <IconVideoOff />}
                        </ActionIcon>

                        <ActionIcon
                            onClick={() => {
                                const message = createServerMessage({
                                    type: "update-device-status",
                                    midi: !midi.enabled,
                                    voice: voice.enabled,
                                    video: video.enabled,
                                });
                                if (socket) {
                                    socket.send(message);
                                }
                                toggleMidi();
                            }}
                            size={48}
                            bg={midi.enabled ? "blue" : "red"}
                        >
                            {midi.enabled ? <IconMusic /> : <IconMusicOff />}
                        </ActionIcon>
                    </ActionIcon.Group>
                    <SettingsPopover />
                </Group>

                <Group>
                    <ActionIcon onClick={openChatDrawer} size={48} variant="default">
                        <IconMessageCircle size={20} />
                    </ActionIcon>
                    {isOwner ? (
                        <Indicator label={waitingList.length} disabled={waitingList.length === 0}>
                            <ActionIcon onClick={openWaitingListDrawer} size={48} variant="default">
                                <IconUserPlus size={20} />
                            </ActionIcon>
                        </Indicator>
                    ) : null}
                </Group>
            </Group>
        </>
    );
};
