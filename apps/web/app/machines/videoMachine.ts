import { useSelector } from "@xstate/react";
import { assign, createActor, enqueueActions, fromPromise, setup } from "xstate";
import { streamActor } from "./streamMachine";

export const videoMachine = setup({
    types: {
        context: {} as {
            device?: MediaDeviceInfo;
            availableDevices: Array<MediaDeviceInfo>;
            enabled: boolean;
            stream?: MediaStream;
        },
        events: {} as
            | {
                  type: "video.setDevice";
                  device: MediaDeviceInfo;
              }
            | {
                  type: "video.scanAvailableDevices";
              }
            | { type: "video.toggle"; enabled: boolean }
            | { type: "video.setStream"; stream: MediaStream },
    },
    actors: {
        scanDevices: fromPromise(async () => {
            const allDevices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = allDevices.filter((d) => d.kind === "videoinput");

            return videoDevices;
        }),
        getStream: fromPromise(async ({ input }: { input: { deviceId?: string } }) => {
            return await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: input.deviceId,
                },
            });
        }),
    },
}).createMachine({
    id: "video",
    context: {
        availableDevices: [],
        enabled: false,
    },
    initial: "initializing",
    states: {
        failure: {},
        initializing: {
            invoke: {
                id: "scanDevices",
                src: "scanDevices",
                onDone: {
                    target: "#video.switchingDevices",
                    actions: assign({
                        availableDevices: ({ event }) => event.output,
                        device: ({ event }) => event.output[0],
                    }),
                },
                onError: {
                    target: "#video.failure",
                },
            },
            "video.toggle": {
                actions: [
                    assign({
                        enabled: ({ event }) => event.enabled,
                    }),
                ],
            },
        },
        initialized: {
            on: {
                "video.scanAvailableDevices": {
                    target: "#video.scanning",
                },
                "video.setDevice": {
                    actions: assign({
                        device: ({ event }) => event.device,
                    }),
                    target: "#video.switchingDevices",
                },
                "video.setStream": {
                    actions: assign({
                        stream: ({ event }) => event.stream,
                    }),
                },
                "video.toggle": {
                    actions: [
                        assign({
                            enabled: ({ event }) => event.enabled,
                        }),
                    ],
                },
            },
        },
        switchingDevices: {
            invoke: {
                id: "getStream",
                src: "getStream",
                input: ({ context }) => ({ deviceId: context.device?.deviceId }),
                onDone: {
                    target: "#video.initialized",
                    actions: enqueueActions(({ enqueue, event, context }) => {
                        enqueue.raise({ type: "video.setStream", stream: event.output });
                        enqueue.sendTo(streamActor, () => {
                            event.output.getVideoTracks().forEach((at) => (at.enabled = context.enabled));
                            return {
                                type: "stream.updateVideoStream",
                                stream: event.output,
                            };
                        });
                    }),
                },
                onError: {
                    target: "#video.failure",
                },
            },
            "video.toggle": {
                actions: [
                    assign({
                        enabled: ({ event }) => event.enabled,
                    }),
                ],
            },
        },
        scanning: {
            invoke: {
                id: "scanDevices",
                src: "scanDevices",
                onDone: {
                    target: "#video.initialized",
                    actions: assign({ availableDevices: ({ event }) => event.output }),
                },
                onError: {
                    target: "#video.failure",
                },
            },
            "video.toggle": {
                actions: [
                    assign({
                        enabled: ({ event }) => event.enabled,
                    }),
                ],
            },
        },
    },
});

export const videoActor = createActor(videoMachine);
export const useVideoStateMachine = () => {
    const state = useSelector(videoActor, (state) => state);

    return {
        ...state,
        send: videoActor.send,
    };
};
