import { usePeers } from "../../store/peersContext";
import { RemoteVideo } from "./RemoteVideo";
import { LocalVideo } from "./LocalVideo";
import { Card, SimpleGrid, Image, Text } from "@mantine/core";
import { User } from "@musicall/storage/types";
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

export const VideoGrid = ({ user }: { user: User }) => {
    const { peers } = usePeers();

    // const totalParticipants = Object.keys(peers).length + 1;
    const totalParticipants = 5;
    const numberOfColumns = cols[totalParticipants];
    const numberOfRows = Math.ceil(totalParticipants / numberOfColumns);
    const leftOverSquares = (numberOfColumns * numberOfRows) % totalParticipants;

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
                <LocalVideo user={user} />
            </Card>
            {Object.keys(peers).map((p) => (
                <Card p={0} radius="md" shadow="md" bg="black" pos="relative" key={`video-${p}`}>
                    <RemoteVideo peerId={peers[p].peerId} />
                </Card>
            ))}

            {/* {[...Array(leftOverSquares)].map((_, index) => (
                <Card withBorder radius="md" shadow="md" key={`ad-${index}`}>
                    <Card.Section>
                        <Image
                            src="https://images.unsplash.com/photo-1579227114347-15d08fc37cae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
                            h={160}
                            alt="No way!"
                        />
                    </Card.Section>

                    <Text fw={500} size="lg" mt="md">
                        You&apos;ve won a million dollars in cash!
                    </Text>

                    <Text mt="xs" c="dimmed" size="sm">
                        Please click anywhere on this card to claim your reward, this is not a fraud, trust us
                    </Text>
                </Card>
            ))} */}
        </SimpleGrid>
    );
};
