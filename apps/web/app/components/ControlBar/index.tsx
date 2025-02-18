"use client";

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
import { useUserStore } from "../../store/userStore";
import { useMidiStateMachine } from "../../machines/midiMachine";
import { useVideoStateMachine } from "../../machines/videoMachine";
import { useVoiceStateMachine } from "../../machines/voiceMachine";
import { useSocketStateMachine } from "../../machines/socketStateMachine";
import { usePeerStateMachine } from "../../machines/peerMachine";
import { useStreamStateMachine } from "../../machines/streamMachine";

export const ControlBar: React.FC = () => {
    const [chatOpened, { open: openChatDrawer, close: closeChatDrawer }] = useDisclosure(false);
    const [participantsOpened, { open: openParticipantsDrawer, close: closeParticipantsDrawer }] = useDisclosure(false);
    const { isOwner } = useUserStore();

    const midiStateMachine = useMidiStateMachine();
    const videoStateMachine = useVideoStateMachine();
    const voiceStateMachine = useVoiceStateMachine();
    const socketStateMachine = useSocketStateMachine();
    const peerStateMachine = usePeerStateMachine();
    const streamStateMachine = useStreamStateMachine();

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
                            disabled={voiceStateMachine.value !== "initialized"}
                            onClick={() => {
                                const message = createServerMessage({
                                    type: "update-device-status",
                                    midi: midiStateMachine.context.enabled,
                                    voice: !voiceStateMachine.context.enabled,
                                    video: videoStateMachine.context.enabled,
                                });
                                socketStateMachine.send({ type: "socket.sendMessage", message });

                                if (streamStateMachine.context.stream) {
                                    streamStateMachine.context.stream.getAudioTracks().forEach((at) => {
                                        at.enabled = !voiceStateMachine.context.enabled;
                                    });
                                }

                                voiceStateMachine.send({
                                    type: "voice.toggle",
                                    enabled: !voiceStateMachine.context.enabled,
                                });

                                streamStateMachine.send({
                                    type: "stream.toggleAudioStreamEnabled",
                                    enabled: !voiceStateMachine.context.enabled,
                                });
                            }}
                            size={48}
                            bg={voiceStateMachine.context.enabled ? "blue" : "red"}
                        >
                            {voiceStateMachine.context.enabled ? <IconMicrophone /> : <IconMicrophoneOff />}
                        </ActionIcon>
                        <ActionIcon
                            disabled={videoStateMachine.value !== "initialized"}
                            onClick={() => {
                                const message = createServerMessage({
                                    type: "update-device-status",
                                    midi: midiStateMachine.context.enabled,
                                    voice: voiceStateMachine.context.enabled,
                                    video: !videoStateMachine.context.enabled,
                                });
                                socketStateMachine.send({ type: "socket.sendMessage", message });

                                if (streamStateMachine.context.stream) {
                                    streamStateMachine.context.stream.getVideoTracks().forEach((at) => {
                                        at.enabled = !videoStateMachine.context.enabled;
                                    });
                                }

                                videoStateMachine.send({
                                    type: "video.toggle",
                                    enabled: !videoStateMachine.context.enabled,
                                });

                                streamStateMachine.send({
                                    type: "stream.toggleVideoStreamEnabled",
                                    enabled: !videoStateMachine.context.enabled,
                                });
                            }}
                            size={48}
                            bg={videoStateMachine.context.enabled ? "blue" : "red"}
                        >
                            {videoStateMachine.context.enabled ? <IconVideo /> : <IconVideoOff />}
                        </ActionIcon>

                        <ActionIcon
                            disabled={midiStateMachine.value !== "initialized"}
                            onClick={() => {
                                const message = createServerMessage({
                                    type: "update-device-status",
                                    midi: !midiStateMachine.context.enabled,
                                    voice: voiceStateMachine.context.enabled,
                                    video: videoStateMachine.context.enabled,
                                });

                                socketStateMachine.send({ type: "socket.sendMessage", message });

                                midiStateMachine.send({
                                    type: "midi.toggle",
                                    enabled: !midiStateMachine.context.enabled,
                                });
                            }}
                            size={48}
                            bg={midiStateMachine.context.enabled ? "blue" : "red"}
                        >
                            {midiStateMachine.context.enabled ? <IconMusic /> : <IconMusicOff />}
                        </ActionIcon>
                    </ActionIcon.Group>
                    <SettingsPopover />
                </Group>

                <Group>
                    <ActionIcon onClick={openChatDrawer} size={48} variant="default">
                        <IconMessageCircle size={20} />
                    </ActionIcon>
                    <Indicator
                        label={isOwner ? peerStateMachine.context.waitingList.length : 0}
                        disabled={!isOwner || peerStateMachine.context.waitingList.length === 0}
                    >
                        <ActionIcon onClick={openParticipantsDrawer} size={48} variant="default">
                            <IconUsers size={20} />
                        </ActionIcon>
                    </Indicator>
                </Group>
            </Group>
        </>
    );
};
