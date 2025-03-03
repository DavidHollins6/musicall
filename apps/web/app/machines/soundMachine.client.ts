"use client";

import { useSelector } from "@xstate/react";
import type { MessageEvent } from "webmidi";
import { assign, createActor, enqueueActions, setup } from "xstate";
import { Instrument } from "@musicall/types/Instrument";
import { KeyboardSoundManager } from "../utils/sound/KeyboardSoundManager.client";
import { ISoundManager } from "../utils/sound/ISoundManager";
import { DrumSoundManager } from "../utils/sound/DrumSoundManager.client";

const soundManagers: Record<string, ISoundManager> = {
    drums: new DrumSoundManager(),
    keyboard: new KeyboardSoundManager(),
};

export const soundMachine = setup({
    types: {} as {
        context: {
            instrument: Instrument;
        };
        events:
            | { type: "sound.playSound"; message: MessageEvent["message"]; instrument: "drums" | "keyboard" }
            | { type: "sound.setInstrument"; instrument: "drums" | "keyboard" }
            | { type: "sound.enableManagers" };
    },
}).createMachine({
    id: "sound",
    context: {
        instrument: localStorage.getItem("instrument") as Instrument | "keyboard",
    },
    initial: "initialized",
    states: {
        initialized: {
            on: {
                "sound.setInstrument": {
                    actions: assign({
                        instrument: ({ event }) => event.instrument,
                    }),
                },
                "sound.enableManagers": {
                    actions: () => {
                        Object.keys(soundManagers).forEach((sm) => soundManagers[sm].enable());
                    },
                },
                "sound.playSound": {
                    actions: enqueueActions(({ event }) => {
                        if (soundManagers[event.instrument]) {
                            soundManagers[event.instrument].handleMidiEvent(event.message);
                        }
                    }),
                },
            },
        },
    },
});

export const soundActor = createActor(soundMachine);

export const useSoundStateMachine = () => {
    const soundState = useSelector(soundActor, (state) => state);

    return {
        ...soundState,
        send: soundActor.send,
    };
};
