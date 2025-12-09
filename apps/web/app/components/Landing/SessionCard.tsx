import { Avatar, Button, Group, Stack, Text, Title } from "@mantine/core";
import { IconClock, IconMusic, IconVideo } from "@tabler/icons-react";
import { formatTimeRange } from "../../utils/formatTimeRange";
import { UpcomingSessionApiResponse } from "@musicall/api/session";

export function SessionCard({ upcomingSession }: { upcomingSession: UpcomingSessionApiResponse }) {
    return (
        <Stack>
            <Group>
                <Avatar size="lg" color="blue">
                    <IconMusic size={32} />
                </Avatar>
                <Stack>
                    <Title order={3}>{upcomingSession.name}</Title>
                    <Text>with {upcomingSession.teacherName}</Text>
                    <Group>
                        <Text>
                            {formatTimeRange(new Date(upcomingSession.startTime), new Date(upcomingSession.endTime))}
                        </Text>
                    </Group>
                </Stack>
            </Group>
            <Group grow>
                <Button
                    leftSection={<IconVideo size={14} />}
                    style={{
                        flexGrow: 1,
                        flexBasis: 0,
                        maxWidth: "75%",
                    }}
                >
                    Join Session
                </Button>
                <Button leftSection={<IconClock size={14} />} variant="outline" maw="25%">
                    Reschedule
                </Button>
            </Group>
        </Stack>
    );
}
