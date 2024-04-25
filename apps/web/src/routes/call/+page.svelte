<script lang="ts">
    import CallBar from "$lib/components/CallBar/CallBar.svelte";
    import VideoGrid from "./VideoGrid.svelte";
    import { DrumSoundManager } from "$lib/soundManager/DrumSoundManager";
    import { page } from "$app/stores";
    import { WebMidi } from "webmidi";
    import HandleMidiInput from "../../lib/components/HandleMidiInput.svelte";
    import { PeerConnection } from "$lib/sockets/PeerConnection.svelte";
    import { createCallStore } from "$lib/store/local/call.svelte";
    import { getSocketStore } from "$lib/store/local/socket.svelte";

    const { data } = $props();

    const socketStore = getSocketStore();
    let soundManager = $state(new DrumSoundManager(data.mappings, data.triggerTypes));

    createCallStore({
        selectedMidiInputId: WebMidi.inputs[0]?.id ?? null,
        isMicrophoneMuted: true,
        isMidiEnabled: true,
        isVideoEnabled: true,
        peerConnection: new PeerConnection(socketStore.socket),
        callId: $page.url.searchParams.get("roomId") as string,
    });
</script>

<div style="height: calc(100% - 66px)" class="flex flex-col">
    <HandleMidiInput {soundManager} />
    <VideoGrid />
    <CallBar {soundManager} midiMappings={data.mappings} midiTriggerTypes={data.triggerTypes} />
</div>
