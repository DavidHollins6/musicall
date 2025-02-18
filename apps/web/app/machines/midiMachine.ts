"use client";

import { useSelector } from "@xstate/react";
import { Input, WebMidi } from "webmidi";
import type { MessageEvent } from "webmidi";
import {
    assign,
    createActor,
    enqueueActions,
    type EventObject,
    fromCallback,
    fromPromise,
    sendTo,
    setup,
} from "xstate";
import { peerActor } from "./peerMachine";
import { DataMessage } from "@musicall/types/dataMessage";

export const midiMachine = setup({
    types: {} as {
        context: {
            inputs: Array<Input>;
            enabled: boolean;
            selectedInput: Input | null;
        };
        events:
            | {
                  type: "midi.scanInputs";
              }
            | {
                  type: "midi.selectMidiInput";
                  selectedInput: Input;
              }
            | { type: "midi.toggle"; enabled: boolean }
            | { type: "midi.sendMessage"; event: MessageEvent };
    },
    actors: {
        enableWebMidi: fromPromise(async () => {
            await WebMidi.enable();
        }),
        addEventListener: fromCallback<EventObject, { device: Input | null }>(({ sendBack, input, receive }) => {
            if (!input.device) {
                return;
            }

            const midiHandler = (e: MessageEvent) => {
                sendBack({
                    type: "midi.sendMessage",
                    event: e,
                });
            };

            input.device.addListener("midimessage", midiHandler);

            const removeListener = () => {
                if (!input.device) {
                    return;
                }
                input.device.removeListener("midimessage", midiHandler);
            };

            receive((event) => {
                if (event.type === "switchInput") {
                    removeListener();
                    if (input.device) {
                        input.device.addListener("midimessage", midiHandler);
                    }
                }
            });

            // Cleanup function
            return () => {
                removeListener();
            };
        }),
    },
}).createMachine({
    id: "midi",
    context: {
        inputs: [],
        enabled: false,
        selectedInput: null,
    },
    initial: "initializing",
    states: {
        failedInitializing: {},
        initializing: {
            invoke: {
                id: "enableWebMidi",
                src: "enableWebMidi",
                onDone: {
                    actions: [
                        enqueueActions(({ enqueue }) => {
                            const inputs = WebMidi.inputs;
                            if (inputs.length > 0) {
                                enqueue.assign({
                                    selectedInput: inputs[0],
                                });
                                enqueue.assign({
                                    inputs: inputs,
                                });
                            }
                        }),
                    ],
                    target: "#midi.initialized",
                },
                onError: {
                    target: "#midi.failedInitializing",
                },
            },
        },
        initialized: {
            invoke: {
                id: "addEventListener",
                src: "addEventListener",
                input: ({ context }) => {
                    return {
                        device: context.selectedInput,
                    };
                },
            },
            on: {
                "midi.scanInputs": {
                    actions: assign({
                        inputs: WebMidi.inputs,
                    }),
                },
                "midi.toggle": {
                    actions: assign({
                        enabled: ({ event }) => event.enabled,
                    }),
                },
                "midi.selectMidiInput": {
                    actions: [
                        assign({
                            selectedInput: ({ event }) => event.selectedInput,
                        }),
                        ({ event }) => sendTo("addEventListener", { type: "switchInput", device: event.selectedInput }),
                    ],
                },
                "midi.sendMessage": {
                    guard: ({ context }) => context.enabled,
                    actions: sendTo(peerActor, ({ event }) => {
                        return {
                            type: "peer.sendDataToAll",
                            message: { type: "midi", message: event.event.message } as DataMessage,
                        };
                    }),
                },
            },
        },
    },
});

export const midiActor = createActor(midiMachine);

export const useMidiStateMachine = () => {
    const midiState = useSelector(midiActor, (state) => state);

    return {
        ...midiState,
        send: midiActor.send,
    };
};
