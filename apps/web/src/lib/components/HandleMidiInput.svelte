<script lang="ts">
    import type { ISoundManager } from "$lib/soundManager/ISoundManager";
    import { getCallStore } from "$lib/store/local/call.svelte";
    import { type MessageEvent } from "webmidi";
    import { WebMidi } from "webmidi";

    let { soundManager }: { soundManager: ISoundManager } = $props();

    const callStore = getCallStore();

    $effect(() => {
        if (callStore.selectedMidiInputId) {
            const input = WebMidi.getInputById(callStore.selectedMidiInputId);

            if (input) {
                input.removeListener("midimessage");
                input.addListener("midimessage", (e) => {
                    if (callStore.isMidiEnabled) {
                        callStore.peerConnection.sendData(JSON.stringify(e.message));
                    }
                });
            }
        }

        callStore.peerConnection.onDataReceived = (msg) => {
            const event = JSON.parse(msg) as MessageEvent["message"];
            soundManager.handleMidiEvent(event);
        };
    });
</script>
