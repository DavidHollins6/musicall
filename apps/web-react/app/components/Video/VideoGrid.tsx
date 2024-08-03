import { usePeers } from "../../store/peersContext";
import { RemoteVideo } from "./RemoteVideo";
import { LocalVideo } from "./LocalVideo";

export const VideoGrid = () => {
    const { peers } = usePeers();
    return (
        <>
            {/* <Grid columns="2" gap="3" rows="2" width="100vw" height="100vh" p="4">
                <Box>
                    <LocalVideo />
                </Box>
                {Object.keys(peers).map((p) => (
                    <Box key={peers[p].peerId}>
                        <RemoteVideo peerId={peers[p].peerId} />
                    </Box>
                ))}
            </Grid> */}
        </>
    );
};
