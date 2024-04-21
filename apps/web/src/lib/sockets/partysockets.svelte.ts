import PartySocket from "partysocket";

export const createSocket = (roomId: string) => {

    const ws = new PartySocket({
        host: "localhost:1999", // or https://musicall.davidhollins6.partykit.dev in prod
        room: roomId,
    });

    return ws
}
