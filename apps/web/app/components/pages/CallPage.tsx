import { useWebRTC } from "../../hooks/useWebRTC";
import { VideoGrid } from "../Video/VideoGrid";
import { Box, Flex, rem, useMantineTheme } from "@mantine/core";
import { ControlBar } from "../ControlBar";
import { useDeviceListener } from "../../hooks/useDeviceListener";
import { User } from "@musicall/storage/types";

type Props = {
    user: User;
    roomId: string;
    isOwner: boolean;
};

export default function CallPage({ user, roomId, isOwner }: Props) {
    const { socket } = useWebRTC({ room: roomId, userId: user.id });
    useDeviceListener();
    const theme = useMantineTheme();

    return (
        <Flex direction="column" w="100%" h="100%">
            <VideoGrid user={user} />
            <Box
                style={{ borderTop: `2px solid ${theme.colors.gray[2]}`, boxShadow: theme.shadows.lg }}
                px={16}
                h={rem("64px")}
            >
                <ControlBar user={user} isOwner={isOwner} socket={socket} />
            </Box>
        </Flex>
    );
}
