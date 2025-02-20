"use client";

import { RemoteVideo } from "./RemoteVideo";
import { LocalVideo } from "./LocalVideo";
import { Card, SimpleGrid, useMatches } from "@mantine/core";
import { usePeerStateMachine } from "../../machines/peerMachine";

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
    const peerStateMachine = usePeerStateMachine();
    const mobileView = useMatches({
        base: true,
        lg: false,
    });

    // const totalParticipants = Object.keys(peers).length + 1;
    const totalParticipants = 5;
    const numberOfColumns = cols[totalParticipants];
    const numberOfRows = Math.ceil(totalParticipants / numberOfColumns);

    const rowHeight = 100 / (mobileView ? 2 : numberOfRows);

    return (
        <SimpleGrid
            flex={1}
            style={{
                gridAutoRows: `calc(${rowHeight}% - 8px)`,
            }}
            p={16}
            w="100%"
            cols={mobileView ? 1 : cols[5]}
            spacing="md"
        >
            <Card p={4} radius="md" shadow="md" bg="black" pos="relative">
                <LocalVideo />
            </Card>
            {Object.keys(peerStateMachine.context.peers).map((p) => (
                <Card p={4} radius="md" shadow="md" bg="black" pos="relative" key={`video-${p}`}>
                    <RemoteVideo peerId={peerStateMachine.context.peers[p].peerId} />
                </Card>
            ))}
        </SimpleGrid>
    );
};
