import { useWebRTC } from "../../hooks/useWebRTC";
import { VideoGrid } from "../Video/VideoGrid";
import { Box, Flex, rem, useMantineTheme } from "@mantine/core";
import { ControlBar } from "../ControlBar";
import { useDeviceListener } from "../../hooks/useDeviceListener";
import { useUserStore } from "../../store/userStore";

type Props = {
    roomId: string;
};

export default function CallPage({ roomId }: Props) {
    const { user } = useUserStore();
    useWebRTC({ room: roomId, userId: user.id });
    useDeviceListener();
    const theme = useMantineTheme();

    return (
        <Flex direction="column" w="100%" h="100%">
            <VideoGrid />
            <Box
                style={{ borderTop: `2px solid ${theme.colors.gray[2]}`, boxShadow: theme.shadows.lg }}
                px={16}
                h={rem("64px")}
            >
                <ControlBar />
            </Box>
        </Flex>
    );
}
