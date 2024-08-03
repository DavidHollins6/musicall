import { useWebRTC } from "../../hooks/useWebRTC";
import { VideoGrid } from "../../components/Video/VideoGrid";
import { ControlBar } from "../ControlBar";
import { useMidi } from "../../hooks/useMidi";
import { usePeers } from "~/store/peersContext";
import { useState } from "react";

type Props = {
    userId: string;
    roomId: string;
};

export default function CallPage({ userId, roomId }: Props) {
    const { socket } = useWebRTC({ room: roomId, userId });
    const webMidiEnabled = useMidi();
    const { chatMessages, waitingList } = usePeers();
    const [message, setMessage] = useState("");

    return (
        <div>
            <VideoGrid />
            {webMidiEnabled ? <ControlBar /> : null}
            {chatMessages.map((m) => (
                <div key={m.timestamp}>
                    {m.message} - {m.from}
                </div>
            ))}

            <input type="text" onChange={(e) => setMessage(e.target.value)} />
            <button
                onClick={() =>
                    socket?.send(JSON.stringify({ type: "chat", from: userId, message, timestamp: Date.now() }))
                }
            >
                Send
            </button>
            <hr />
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
        </div>
    );
}
