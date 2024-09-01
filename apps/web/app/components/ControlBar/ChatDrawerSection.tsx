import { Avatar, Box, Flex, Stack, Text, TextInput } from "@mantine/core";
import { usePeers } from "../../store/peersContext";
import PartySocket from "partysocket";
import { useState } from "react";
import { User } from "@musicall/storage";
import { createServerMessage } from "@musicall/types/serverMessage";

export const ChatDrawerSection: React.FC<{ socket: PartySocket; user: User }> = ({
    socket,
    user,
}: {
    socket: PartySocket;
    user: User;
}) => {
    const { chatMessages } = usePeers();
    const [message, setMessage] = useState("");

    return (
        <Stack pt={16} h="100%">
            <Box flex={1}>
                {chatMessages.map((message) => (
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
                    socket.send(serverMessage);
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
