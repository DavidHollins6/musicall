<script lang="ts">
    import CallBar from "$lib/components/CallBar/CallBar.svelte";
    import { DrumSoundManager } from "$lib/soundManager/DrumSoundManager";
    import { page } from "$app/stores";
    import { WebMidi } from "webmidi";
    import HandleMidiInput from "../../lib/components/HandleMidiInput.svelte";
    import { WebRTCHandler } from "$lib/sockets/WebRTCHandler";
    import { createCallStore } from "$lib/store/local/call.svelte";
    import { getSocketStore } from "$lib/store/local/socket.svelte";
    import CallPanel from "$lib/components/CallPanel/CallPanel.svelte";
    import HandleChatMessages from "$lib/components/Chat/HandleChatMessages.svelte";
    import { createUIStore } from "$lib/store/local/ui.svelte";
    import { createChatStore } from "$lib/store/local/chat.svelte";

    const { data } = $props();

    const socketStore = getSocketStore();
    let soundManager = $state(new DrumSoundManager(data.mappings, data.triggerTypes));

    createCallStore({
        inputs: {
            microphone: {
                id: null,
                enabled: false,
            },
            midi: {
                id: WebMidi.inputs[0].id ?? null,
                enabled: false,
            },
            video: {
                id: null,
                enabled: false,
            },
        },
        webRTCHandler: new WebRTCHandler(socketStore.socket, data.userId),
        callId: $page.url.searchParams.get("roomId") as string,
        localStream: null,
        peers: {},
    });

    createUIStore({
        sidePanel: null,
    });

    createChatStore({
        chatMessages: [],
        unreadMessages: 0,
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
