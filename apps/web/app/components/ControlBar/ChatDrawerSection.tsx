"use client";

import { Avatar, Box, Flex, Stack, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { createServerMessage } from "@musicall/types/serverMessage";
import { useUserStore } from "../../store/userStore";
import { useChatStateMachine } from "../../machines/chatMachine";
import { useSocketStateMachine } from "../../machines/socketStateMachine.client";

export const ChatDrawerSection: React.FC = () => {
    const chatStateMachine = useChatStateMachine();
    const socketStateMachine = useSocketStateMachine();
    const [message, setMessage] = useState("");
    const { user } = useUserStore();
    return (
        <Stack pt={16} h="100%">
            <Box flex={1}>
                {chatStateMachine.context.messages.map((message) => (
                    <Flex
                        gap={8}
                        direction={message.from.id === user.id ? "row-reverse" : "row"}
                        key={message.timestamp}
                    >
                        <Avatar radius="xl" />
                        <Stack gap={4}>
                            <Text
                                style={{
                                    textAlign: message.from.id === user.id ? "right" : "left",
                                    borderRadius: "16px",
                                }}
                                flex={1}
                                fw={600}
                            >
                                {message.from.name}
                            </Text>

                            <Text
                                style={{
                                    borderRadius: "16px",
                                    borderTopRightRadius: message.from.id === user.id ? "0" : "16px",
                                    borderTopLeftRadius: message.from.id === user.id ? "16px" : "0",
                                    color: message.from.id === user.id ? "white" : "black",
                                }}
                                bg={message.from.id === user.id ? "blue" : "lightgray"}
                                p={12}
                            >
                                {message.message}
                            </Text>
                        </Stack>
                    </Flex>
                ))}
            </Box>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const serverMessage = createServerMessage({
                        type: "chat",
                        message,
                        from: user,
                        timestamp: Date.now(),
                    });
                    socketStateMachine.send({ type: "socket.sendMessage", message: serverMessage });
                    setMessage("");
                }}
            >
                <TextInput
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    name="message"
                    aria-label="Message"
                    placeholder="Message..."
                    autoComplete="off"
                />
            </form>
        </Stack>
    );
};
