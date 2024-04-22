<script lang="ts">
    import { getContext, onMount } from "svelte";
    import { WebMidi } from "webmidi";
    import MicRoundedIcon from "~icons/mdi/microphone";
    import MicOffIcon from "~icons/mdi/microphone-off";
    import CameraIcon from "~icons/mdi/camera";
    import MusicNoteIcon from "~icons/mdi/music-note";
    import MusicNoteOffIcon from "~icons/mdi/music-note-off";
    import CameraOffIcon from "~icons/mdi/camera-off";
    import MenuIcon from "~icons/mdi/dots-vertical";
    import HangUpIcon from "~icons/mdi/phone-hangup";
    import type { CallContext } from "./createCallState.svelte";
    import { DrumSoundManager } from "$lib/utils/SoundManager/DrumSoundManager";
    import { KeyboardSoundManager } from "$lib/utils/SoundManager/KeyboardSoundManager";

    const callContext = getContext<CallContext>("call");

    let audioInputDevices = $state<MediaDeviceInfo[]>([]);
    let videoInputDevices = $state<MediaDeviceInfo[]>([]);

    onMount(async () => {
        if (!callContext.peerConnection.checkedUserMediaPermissions) {
            await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { min: 640, ideal: 1920, max: 1920 },
                    height: { min: 480, ideal: 1080, max: 1080 },
                },
                audio: true,
            });
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        audioInputDevices = devices.filter((device) => device.kind === "audioinput");
        videoInputDevices = devices.filter((device) => device.kind === "videoinput");
    });
</script>

<div class="w-full justify-center flex p-4 gap-4">
    <div class="drawer">
        <input id="my-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
            <label for="my-drawer" class="btn btn-square btn-secondary drawer-button text-2xl"><MenuIcon /></label>
        </div>
        <div class="drawer-side">
            <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
            <div class="menu p-4 w-80 min-h-full bg-base-200 text-base-content flex flex-col">
                <label class="form-control w-full max-w-xs">
                    <div class="label">
                        <span class="label-text">Video</span>
                    </div>
                    <select
                        on:change={(e) => {
                            callContext.peerConnection.setVideoInput(e.currentTarget.value);
                        }}
                        class="select select-bordered select-sm w-full"
                        value={callContext.peerConnection.localVideoDeviceId}
                    >
                        {#each videoInputDevices as device}
                            <option value={device.deviceId}>{device.label}</option>
                        {/each}
                    </select>
                </label>
                <label class="form-control w-full max-w-xs">
                    <div class="label">
                        <span class="label-text">Audio</span>
                    </div>
                    <select
                        on:change={(e) => {
                            callContext.peerConnection.setAudioInput(e.currentTarget.value);
                        }}
                        class="select select-bordered select-sm w-full"
                        value={callContext.peerConnection.localAudioDeviceId}
                    >
                        {#each audioInputDevices as device}
                            <option value={device.deviceId}>{device.label}</option>
                        {/each}
                    </select>
                </label>
                <label class="form-control w-full max-w-xs">
                    <div class="label">
                        <span class="label-text">Midi Device</span>
                    </div>
                    <select
                        on:change={(e) => {
                            callContext.selectedMidiInputId = e.currentTarget.value;
                        }}
                        class="select select-bordered select-sm w-full"
                    >
                        {#each WebMidi.inputs as midiInput}
                            <option value={midiInput.id}>{midiInput.name}</option>
                        {/each}
                    </select>
                </label>
                <label class="form-control w-full max-w-xs">
                    <div class="label">
                        <span class="label-text">Instrument</span>
                    </div>
                    <select
                        on:change={(e) => {
                            switch (e.currentTarget.value) {
                                case "drums":
                                    callContext.soundManager = new DrumSoundManager(
                                        callContext.midiMappings,
                                        callContext.midiTriggerTypes,
                                    );
                                    break;
                                case "keyboard":
                                    callContext.soundManager = new KeyboardSoundManager(
                                        callContext.midiMappings,
                                        callContext.midiTriggerTypes,
                                    );
                                    break;
                            }
                        }}
                        class="select select-bordered select-sm w-full"
                    >
                        <option value="drums">Drums</option>
                        <option value="keyboard">Keyboard</option>
                    </select>
                </label>
            </div>
        </div>
    </div>
    <button
        on:click={() => {
            callContext.isMidiEnabled = !callContext.isMidiEnabled;
        }}
        class={`btn btn-square text-2xl ${callContext.isMidiEnabled ? "btn-success" : "btn-warning"}`}
    >
        {#if callContext.isMidiEnabled}
            <MusicNoteIcon />
        {:else}
            <MusicNoteOffIcon />
        {/if}
    </button>
    <button
        on:click={() => {
            callContext.peerConnection.toggleMic(!callContext.isMicrophoneMuted);
            callContext.isMicrophoneMuted = !callContext.isMicrophoneMuted;
        }}
        class={`btn btn-square text-2xl ${callContext.isMicrophoneMuted ? "btn-warning" : "btn-success"}`}
    >
        {#if callContext.isMicrophoneMuted}
            <MicOffIcon />
        {:else}
            <MicRoundedIcon />
        {/if}
    </button>
    <button
        on:click={async () => {
            await callContext.peerConnection.toggleCamera(!callContext.isVideoEnabled);
            callContext.isVideoEnabled = !callContext.isVideoEnabled;
        }}
        class={`btn btn-square text-2xl ${callContext.isVideoEnabled ? "btn-success" : "btn-warning"}`}
    >
        {#if callContext.isVideoEnabled}
            <CameraIcon />
        {:else}
            <CameraOffIcon />
        {/if}
    </button>
    <button on:click={() => {}} class={`ml-16 w-24 text-2xl btn btn-square btn-error`}>
        <HangUpIcon />
    </button>
</div>
