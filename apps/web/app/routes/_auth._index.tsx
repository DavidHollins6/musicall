import { type LinksFunction, type LoaderFunctionArgs, json } from "@remix-run/node";

import styles from "../styles/global.css?url";
import { requireAuthSession } from "../modules/auth/session.server";
import { getUpcomingSessionsForStudent, UpcomingSessionApiResponse } from "@musicall/api/session";
import { useLoaderData } from "@remix-run/react";
import { Card, Container, Group, Title } from "@mantine/core";

import { useSessionStore } from "../store/sessionStore";
import { SessionCard } from "../components/Landing/SessionCard";
import { ScheduleModal } from "../components/Landing/ScheduleModal";
import { getStudentsForTeacher } from "@musicall/api/user";

export async function loader({ request }: LoaderFunctionArgs) {
    const { userId } = await requireAuthSession(request);

    const sessions = await getUpcomingSessionsForStudent(userId);
    const students = await getStudentsForTeacher(userId);

    return json({ sessions, students });
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function Index() {
    const { user } = useSessionStore();
    const { sessions, students } = useLoaderData<typeof loader>();

    return (
        <Container>
            <Title mt={12} order={1}>
                Welcome {user?.name}! {user?.type}
            </Title>
            <Card shadow="sm" mt={20} padding="lg" radius="lg" withBorder>
                <Card.Section withBorder>
                    <Group p={24} justify="space-between">
                        <Title size={16} order={2}>
                            Upcoming Sessions
                        </Title>
                        {user?.type === "teacher" ? <ScheduleModal students={students} /> : null}
                    </Group>
                </Card.Section>

                {sessions.map((session) => (
                    <Card.Section withBorder p={24} key={session.id}>
                        <SessionCard upcomingSession={session as unknown as UpcomingSessionApiResponse} />
                    </Card.Section>
                ))}
            </Card>
        </Container>
    );
}
