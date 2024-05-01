<script lang="ts">
    import CallBar from "$lib/components/CallBar/CallBar.svelte";
    import { DrumSoundManager } from "$lib/soundManager/DrumSoundManager";
    import { page } from "$app/stores";
    import { WebMidi } from "webmidi";
    import HandleMidiInput from "../../lib/components/HandleMidiInput.svelte";
    import { WebRTCHandler } from "$lib/sockets/WebRTCHandler.svelte";
    import { createCallStore } from "$lib/store/local/call.svelte";
    import { getSocketStore } from "$lib/store/local/socket.svelte";
    import CallPanel from "$lib/components/CallPanel/CallPanel.svelte";
    import HandleChatMessages from "$lib/components/Chat/HandleChatMessages.svelte";

    const { data } = $props();

    const socketStore = getSocketStore();
    let soundManager = $state(new DrumSoundManager(data.mappings, data.triggerTypes));

    createCallStore({
        selectedMidiInputId: WebMidi.inputs[0]?.id ?? null,
        isMicrophoneEnabled: false,
        isMidiEnabled: true,
        isVideoEnabled: true,
        webRTCHandler: new WebRTCHandler(socketStore.socket, data.userId),
        callId: $page.url.searchParams.get("roomId") as string,
        isSidePanelOpen: false,
        chatMessages: [],
        unreadMessages: 4,
        sidePanel: "participants",
    });
</script>

<div
    style="height: calc(100vh - 67px - 81px); max-height: calc(100vh - 66px - 81px)"
    class="flex flex-col justify-between relative"
>
    <HandleMidiInput {soundManager} />
    <HandleChatMessages />
    <CallPanel />
    <div>
        <CallBar {soundManager} midiMappings={data.mappings} midiTriggerTypes={data.triggerTypes} />
    </div>
</div>
