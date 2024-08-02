import { useWebRTC } from "../../hooks/useWebRTC";
import { VideoGrid } from "../../components/Video/VideoGrid";
import { ControlBar } from "../ControlBar";
import { Flex } from "@radix-ui/themes";
import { useMidi } from "../../hooks/useMidi";
import { usePeers } from "~/store/peersContext";

type Props = {
    userId: string;
    roomId: string;
};

export default function CallPage({ userId, roomId }: Props) {
    const { socket } = useWebRTC({ room: roomId, userId });
    const webMidiEnabled = useMidi();
    const { waitingList } = usePeers();

    console.log(waitingList);

    return (
        <Flex direction="column" maxHeight="100vh">
            <VideoGrid />
            {webMidiEnabled ? <ControlBar /> : null}
            {waitingList.map((w) => (
                <>
                    <p key={w}>{w}</p>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            socket.send(JSON.stringify({ type: "allow-into-room", userId: w }));
                        }}
                    >
                        Allow
                    </button>
                </>
            ))}
        </Flex>
    );
}
