import { getContext, setContext } from "svelte";

const STORE_NAME = "ui";

export type Context = {
    sidePanel: "chat" | "participants" | null;
};

export function createUIStore(initial: Context) {
    let sidePanel = $state(initial.sidePanel);

    setContext(STORE_NAME, {
        get sidePanel() {
            return sidePanel;
        },
        set sidePanel(value) {
            sidePanel = value;
        },
    });
}

export function getUIStore() {
    return getContext<Context>(STORE_NAME);
}
