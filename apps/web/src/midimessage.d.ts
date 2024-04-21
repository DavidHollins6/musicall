declare module "midimessage" {
    function midimessage(message: MessageEvent["message"]): {
        channel: number;
        key: number;
        velocity: number;
        messageType: "noteon" | "noteoff" | "controlchange";
    };
    export = midimessage;
}
