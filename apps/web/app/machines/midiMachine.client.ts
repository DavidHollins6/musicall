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
import { Instrument } from "@musicall/types/Instrument";
import { KeyboardSoundManager } from "../utils/sound/KeyboardSoundManager.client";
import { ISoundManager } from "../utils/sound/ISoundManager";
import { DrumSoundManager } from "../utils/sound/DrumSoundManager.client";

const soundManagers: Record<string, ISoundManager> = {
    drums: new DrumSoundManager(),
    keyboard: new KeyboardSoundManager(),
};

export const midiMachine = setup({
    types: {} as {
        context: {
            inputs: Array<Input>;
            enabled: boolean;
            selectedInput: Input | null;
            type: "local" | "peers";
            instrument: Instrument;
        };
        events:
            | {
                  type: "midi.scanInputs";
              }
            | {
                  type: "midi.selectMidiInput";
                  selectedInput: Input;
              }
            | {
                  type: "midi.setType";
                  newType: "local" | "peers";
              }
            | { type: "midi.toggle"; enabled: boolean }
            | { type: "midi.sendMessage"; event: MessageEvent }
            | { type: "midi.playSound"; message: MessageEvent["message"]; instrument: "drums" | "keyboard" }
            | { type: "midi.setInstrument"; instrument: "drums" | "keyboard" }
            | { type: "midi.enableManagers" };
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
        type: "local",
        instrument: localStorage.getItem("instrument") as Instrument | "keyboard",
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
            on: {
                "midi.toggle": {
                    actions: assign({
                        enabled: ({ event }) => event.enabled,
                    }),
                },
                "midi.setType": {
                    actions: assign({
                        type: ({ event }) => event.newType,
                    }),
                },
                "midi.setInstrument": {
                    actions: assign({
                        instrument: ({ event }) => event.instrument,
                    }),
                },
                "midi.enableManagers": {
                    actions: () => {
                        Object.keys(soundManagers).forEach((sm) => soundManagers[sm].enable());
                    },
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
                "midi.setInstrument": {
                    actions: assign({
                        instrument: ({ event }) => event.instrument,
                    }),
                },
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
                "midi.playSound": {
                    actions: enqueueActions(({ event }) => {
                        if (soundManagers[event.instrument]) {
                            soundManagers[event.instrument].handleMidiEvent(event.message);
                        }
                    }),
                },
                "midi.sendMessage": {
                    guard: ({ context }) => context.enabled,
                    actions: enqueueActions(({ enqueue, event, context }) => {
                        if (context.type === "peers") {
                            enqueue.sendTo(peerActor, () => {
                                return {
                                    type: "peer.sendDataToAll",
                                    message: {
                                        type: "midi",
                                        message: {
                                            message: event.event.message,
                                            instrument: context.instrument,
                                        },
                                    } as DataMessage,
                                };
                            });
                        }

                        if (context.type === "local") {
                            enqueue.raise({
                                type: "midi.playSound",
                                message: event.event.message,
                                instrument: context.instrument,
                            });
                        }
                    }),
                },
                "midi.enableManagers": {
                    actions: () => {
                        Object.keys(soundManagers).forEach((sm) => soundManagers[sm].enable());
                    },
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
