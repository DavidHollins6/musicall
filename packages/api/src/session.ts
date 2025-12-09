export type UpcomingSessionApiResponse = {
    id: string;
    startTime: Date;
    endTime: Date;
    type: string;
    instrument: string;
    name: string;
    cancelled: boolean;
    teacherName: string;
};

export const getUpcomingSessionsForStudent = async (id: string): Promise<Array<UpcomingSessionApiResponse>> => {
    const response = await fetch(`${process.env.API_URL}/user/${id}/sessions/upcoming`);
    if (response.ok) {
        const sessions = (await response.json()) as Array<UpcomingSessionApiResponse>;
        return sessions;
    }

    console.error("Error getting sessions: ", response.status);
    return [];
};
