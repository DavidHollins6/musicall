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
import { useDevice, useDeviceDispatcher } from "../../store/deviceContext";
import { SettingsPopover } from "./SettingsPopover";
import { WaitingListDrawer } from "./WaitingListDrawer";
import PartySocket from "partysocket";
import { usePeers } from "../../store/peersContext";
import { User } from "@musicall/storage";
import { createServerMessage } from "@musicall/types/serverMessage";

export const ControlBar: React.FC<{ isOwner: boolean; socket: PartySocket; user: User }> = ({
    isOwner,
    socket,
    user,
}: {
    isOwner: boolean;
    socket: PartySocket;
    user: User;
}) => {
    const [chatOpened, { open: openChatDrawer, close: closeChatDrawer }] = useDisclosure(false);
    const [waitingListopened, { open: openWaitingListDrawer, close: closeWaitingListDrawer }] = useDisclosure(false);
    const { video, midi, voice } = useDevice();
    const { waitingList } = usePeers();
    const dispatch = useDeviceDispatcher();

    return (
        <>
            <Drawer
                styles={{ body: { height: "calc(100% - 60px)" } }}
                opened={chatOpened}
                onClose={closeChatDrawer}
                title="Chat"
                position="right"
            >
                <ChatDrawerSection user={user} socket={socket} />
            </Drawer>
            <Drawer
                styles={{ body: { height: "calc(100% - 60px)" } }}
                opened={waitingListopened}
                onClose={closeWaitingListDrawer}
                title="Waiting List"
                position="right"
            >
                <WaitingListDrawer socket={socket} />
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
                                socket.send(message);
                                dispatch({ type: "toggleVoice" });
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
                                socket.send(message);
                                dispatch({ type: "toggleVideo" });
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
                                socket.send(message);
                                dispatch({ type: "toggleMidi" });
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
