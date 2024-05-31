import { useMachine } from "@xstate/svelte";
import { createMachine } from "xstate";
import { getContext, setContext } from "svelte";

export const TOGGLE_CONTEXT_NAME = "toggle";
export const toggleMachine = createMachine({
    id: "toggle",
    initial: "inactive",
    states: {
        inactive: {
            on: { TOGGLE: "active" },
        },
        active: {
            on: { TOGGLE: "inactive" },
        },
    },
});

export type Actor = ReturnType<typeof useMachine<typeof toggleMachine>>;

export const createToggleMachine = () => {
    setContext(TOGGLE_CONTEXT_NAME, useMachine(toggleMachine));
};

export const getToggleMachine = () => {
    return getContext<Actor>(TOGGLE_CONTEXT_NAME);
};
