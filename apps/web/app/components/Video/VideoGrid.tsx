import { RemoteVideo } from "./RemoteVideo";
import { LocalVideo } from "./LocalVideo";
import { Card, SimpleGrid } from "@mantine/core";
import { usePeerStore } from "../../store/peerStore";

const cols = {
    1: 1,
    2: 2,
    3: 3,
    4: 2,
    5: 3,
    6: 3,
    7: 3,
    8: 3,
};

export const VideoGrid = () => {
    const { peers } = usePeerStore();

    // const totalParticipants = Object.keys(peers).length + 1;
    const totalParticipants = 5;
    const numberOfColumns = cols[totalParticipants];
    const numberOfRows = Math.ceil(totalParticipants / numberOfColumns);

    const rowHeight = 100 / numberOfRows;

    return (
        <SimpleGrid
            flex={1}
            style={{
                gridAutoRows: `calc(${rowHeight}% - 8px)`,
            }}
            p={16}
            w="100%"
            cols={cols[5]}
            spacing="md"
        >
            <Card p={0} radius="md" shadow="md" bg="black" pos="relative">
                <LocalVideo />
            </Card>
            {Object.keys(peers).map((p) => (
                <Card p={0} radius="md" shadow="md" bg="black" pos="relative" key={`video-${p}`}>
                    <RemoteVideo peerId={peers[p].peerId} />
                </Card>
            ))}
        </SimpleGrid>
    );
};
