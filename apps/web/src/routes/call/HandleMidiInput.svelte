<script lang="ts">
    import { getContext } from "svelte";
    import { WebMidi } from "webmidi";
    import type { CallContext } from "./createCallState.svelte";

    const callContext = getContext<CallContext>("call");

    $effect(() => {
        if (callContext.selectedMidiInputId) {
            const input = WebMidi.getInputById(callContext.selectedMidiInputId);

            if (input) {
                input.removeListener("midimessage");
                input.addListener("midimessage", (e) => {
                    if (callContext.isMidiEnabled) {
                        callContext.peerConnection.sendData(JSON.stringify(e.message));
                    }
                });
            }
        }
    });
</script>
