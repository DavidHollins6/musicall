<script lang="ts">
    import { onMount, getContext } from "svelte";
    import { type MessageEvent } from "webmidi";
    import type { CallContext } from "./createCallState.svelte";

    const callContext = getContext<CallContext>("call");

    onMount(() => {
        callContext.peerConnection.connect(callContext.callId);

        callContext.peerConnection.onDataReceived = (msg) => {
            const event = JSON.parse(msg) as MessageEvent["message"];
            callContext.soundManager.handleMidiEvent(event);
        };
    });
</script>
