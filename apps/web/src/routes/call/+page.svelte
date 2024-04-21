<script lang="ts">
    import CallBar from "./CallBar.svelte";
    import TwoWayVideo from "./TwoWayVideo.svelte";
    import { DrumSoundManager } from "$lib/utils/SoundManager/DrumSoundManager";
    import { setContext } from "svelte";
    import { page } from "$app/stores";
    import { WebMidi } from "webmidi";
    import type { PageData } from "./$types";
    import createCallState from "./createCallState.svelte";
    import HandlePeerConnection from "./HandlePeerConnection.svelte";
    import HandleMidiInput from "./HandleMidiInput.svelte";
    import { PeerConnection } from "$lib/sockets/PeerConnection.svelte";

    const { data } = $props<{ data: PageData }>();

    let callState = createCallState({
        selectedMidiInputId: WebMidi.inputs[0]?.id ?? null,
        isMicrophoneMuted: true,
        isMidiEnabled: true,
        isVideoEnabled: true,
        peerConnection: new PeerConnection($page.url.searchParams.get("roomId") as string),
        soundManager: new DrumSoundManager(data.mappings, data.triggerTypes),
        callId: $page.url.searchParams.get("roomId") as string,
        midiMappings: data.mappings,
        midiTriggerTypes: data.triggerTypes,
    });

    setContext("call", callState);
</script>

<div style="height: calc(100% - 66px)" class="flex flex-col">
    <HandleMidiInput />
    <HandlePeerConnection />
    <TwoWayVideo />
    <CallBar />
    <button on:click={() => callState.peerConnection.sendData("HELLO!!!!")}>Click meee</button>
</div>
