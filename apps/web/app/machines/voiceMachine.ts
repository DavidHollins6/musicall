import { useSelector } from "@xstate/react";
import { assign, createActor, enqueueActions, fromPromise, setup } from "xstate";
import { streamActor } from "./streamMachine";

export const voiceMachine = setup({
    types: {} as {
        context: {
            device?: MediaDeviceInfo;
            availableDevices: Array<MediaDeviceInfo>;
            enabled: boolean;
            stream?: MediaStream;
        };
        events:
            | {
                  type: "voice.setDevice";
                  device: MediaDeviceInfo;
              }
            | {
                  type: "voice.scanAvailableDevices";
              }
            | { type: "voice.toggle"; enabled: boolean }
            | { type: "voice.setStream"; stream: MediaStream };
    },
    actors: {
        scanDevices: fromPromise(async () => {
            const allDevices = await navigator.mediaDevices.enumerateDevices();
            return allDevices.filter((d) => d.kind === "audioinput");
        }),
        getStream: fromPromise(async ({ input }: { input: { deviceId?: string } }) => {
            return await navigator.mediaDevices.getUserMedia({
                audio: {
                    deviceId: input.deviceId,
                },
            });
        }),
    },
}).createMachine({
    id: "voice",
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
                    target: "#voice.switchingDevices",
                    actions: assign({
                        availableDevices: ({ event }) => event.output,
                        device: ({ event }) => event.output[0],
                    }),
                },
                onError: {
                    target: "#voice.failure",
                },
            },
            on: {
                "voice.toggle": {
                    actions: [
                        assign({
                            enabled: ({ event }) => event.enabled,
                        }),
                    ],
                },
            },
        },
        initialized: {
            on: {
                "voice.scanAvailableDevices": {
                    target: "#voice.scanning",
                },
                "voice.setDevice": {
                    actions: assign({
                        device: ({ event }) => event.device,
                    }),
                    target: "#voice.switchingDevices",
                },
                "voice.setStream": {
                    actions: assign({
                        stream: ({ event }) => event.stream,
                    }),
                },
                "voice.toggle": {
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
                    target: "#voice.initialized",
                    actions: enqueueActions(({ enqueue, event, context }) => {
                        enqueue.raise({ type: "voice.setStream", stream: event.output });
                        enqueue.sendTo(streamActor, () => {
                            event.output.getAudioTracks().forEach((at) => (at.enabled = context.enabled));
                            return {
                                type: "stream.updateAudioStream",
                                stream: event.output,
                            };
                        });
                    }),
                },
                onError: {
                    target: "#voice.failure",
                },
            },
            on: {
                "voice.toggle": {
                    actions: [
                        assign({
                            enabled: ({ event }) => event.enabled,
                        }),
                    ],
                },
            },
        },
        scanning: {
            invoke: {
                id: "scanDevices",
                src: "scanDevices",
                onDone: {
                    target: "#voice.initialized",
                    actions: assign({ availableDevices: ({ event }) => event.output }),
                },
                onError: {
                    target: "#voice.failure",
                },
            },
            on: {
                "voice.toggle": {
                    actions: [
                        assign({
                            enabled: ({ event }) => event.enabled,
                        }),
                    ],
                },
            },
        },
    },
});

export const voiceActor = createActor(voiceMachine);

export const useVoiceStateMachine = () => {
    const state = useSelector(voiceActor, (state) => state);

    return {
        ...state,
        send: voiceActor.send,
    };
};
