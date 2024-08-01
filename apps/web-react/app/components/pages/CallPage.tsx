import { useState } from "react";
import { useWebRTC } from "../../hooks/useWebRTC";
import { VideoGrid } from "../../components/Video/VideoGrid";
import { ControlBar } from "../ControlBar";
import { Flex } from "@radix-ui/themes";
import { useMidi } from "~/hooks/useMidi";

export default function CallPage() {
    const [userId] = useState(`${Math.random() * 100}`);
    useWebRTC({ room: "1234", userId });
    const webMidiEnabled = useMidi();

    return (
        <Flex direction="column" maxHeight="100vh">
            <VideoGrid />
            {webMidiEnabled ? <ControlBar /> : null}
        </Flex>
    );
}
