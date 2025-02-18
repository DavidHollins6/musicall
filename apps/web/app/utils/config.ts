export const USE_TRICKLE = true;
export const CONFIG = {
    iceServers: [
        { urls: ["STUN:freeturn.net:3478", "STUN:freeturn.net:5349"] },
        {
            urls: "TURN:freeturn.net:3478",
            username: "free",
            credential: "free",
        },
        {
            urls: "TURN:freeturn.net:5349",
            username: "free",
            credential: "free",
        },
        {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject",
        },
    ],
};
