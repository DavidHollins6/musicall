<script lang="ts">
    import CallBar from "$lib/components/CallBar/CallBar.svelte";
    import { DrumSoundManager } from "$lib/soundManager/DrumSoundManager";
    import { page } from "$app/stores";
    import { WebMidi } from "webmidi";
    import HandleMidiInput from "../../lib/components/HandleMidiInput.svelte";
    import { WebRTCHandler } from "$lib/sockets/WebRTCHandler.svelte";
    import { createCallStore } from "$lib/store/local/call.svelte";
    import { getSocketStore } from "$lib/store/local/socket.svelte";
    import VideoGrid from "$lib/components/Video/VideoGrid.svelte";

    const { data } = $props();

    const socketStore = getSocketStore();
    let soundManager = $state(new DrumSoundManager(data.mappings, data.triggerTypes));

    console.log("userid", data.userId);

    createCallStore({
        selectedMidiInputId: WebMidi.inputs[0]?.id ?? null,
        isMicrophoneEnabled: false,
        isMidiEnabled: true,
        isVideoEnabled: true,
        webRTCHandler: new WebRTCHandler(socketStore.socket, data.userId),
        callId: $page.url.searchParams.get("roomId") as string,
    });
</script>

<div style="height: calc(100% - 66px)" class="flex flex-col">
    <HandleMidiInput {soundManager} />
    <VideoGrid />
    <CallBar {soundManager} midiMappings={data.mappings} midiTriggerTypes={data.triggerTypes} />
</div>
