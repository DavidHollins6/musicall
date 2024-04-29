<script lang="ts">
    import type { ISoundManager } from "$lib/soundManager/ISoundManager";
    import { getCallStore } from "$lib/store/local/call.svelte";
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
                        callStore.webRTCHandler.sendData({
                            type: "midi",
                            event: e.message,
                            from: callStore.webRTCHandler.socket.id,
                        });
                    }
                });
            }
        }

        callStore.webRTCHandler.onMidiMessageReceived = soundManager.handleMidiEvent;
    });
</script>
