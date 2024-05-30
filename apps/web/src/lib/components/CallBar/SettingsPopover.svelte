<script lang="ts">
    import SettingsIcon from "~icons/mdi/settings";
    import { getCallStore } from "$lib/store/local/call.svelte";
    import { WebMidi } from "webmidi";
    import type { ISoundManager } from "$lib/soundManager/ISoundManager";
    import { DrumSoundManager } from "$lib/soundManager/DrumSoundManager";
    import { KeyboardSoundManager } from "$lib/soundManager/KeyboardSoundManager";
    import type { Mapping, TriggerType } from "$lib/db/schema";
    import { onMount } from "svelte";

    let {
        soundManager,
        midiMappings,
        midiTriggerTypes,
    }: { soundManager: ISoundManager; midiMappings: Mapping[]; midiTriggerTypes: TriggerType[] } = $props();

    const callStore = getCallStore();

    let audioInputDevices = $state<MediaDeviceInfo[]>([]);
    let videoInputDevices = $state<MediaDeviceInfo[]>([]);

    onMount(async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        audioInputDevices = devices.filter((device) => device.kind === "audioinput");
        videoInputDevices = devices.filter((device) => device.kind === "videoinput");
    });

    const updateVideoStream = async (deviceId: string) => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId,
                width: { min: 640, ideal: 1920, max: 1920 },
                height: { min: 480, ideal: 1080, max: 1080 },
            },
        });

        stream.getVideoTracks().forEach((t) => {
            Object.keys(callStore.webRTCHandler.peers).forEach((k) => {
                callStore.webRTCHandler.peers[k].peerConnection.addTrack(t, stream);
            });
        });
    };

    const updateAudioStream = async (deviceId: string) => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId,
                width: { min: 640, ideal: 1920, max: 1920 },
                height: { min: 480, ideal: 1080, max: 1080 },
            },
        });

        stream.getAudioTracks().forEach((t) => {
            Object.keys(callStore.webRTCHandler.peers).forEach((k) => {
                callStore.webRTCHandler.peers[k].peerConnection.addTrack(t, stream);
            });
        });
    };
</script>

<details class="dropdown dropdown-top dropdown-end">
    <summary class="btn text-2xl shadow-md"><SettingsIcon /></summary>
    <div class="p-4 mb-1 menu dropdown-content z-[1] bg-base-100 w-64 rounded-lg shadow-lg">
        <label class="form-control w-full max-w-xs">
            <div class="label">
                <span class="label-text">Video</span>
            </div>
            <select
                onchange={async (e) => {
                    await updateVideoStream(e.currentTarget.value);
                    callStore.inputs.video.id = e.currentTarget.value;
                }}
                class="select select-bordered select-sm w-full"
                value={callStore.inputs.video.id}
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
                onchange={async (e) => {
                    await updateAudioStream(e.currentTarget.value);
                    callStore.inputs.microphone.id = e.currentTarget.value;
                }}
                class="select select-bordered select-sm w-full"
                value={callStore.inputs.microphone.id}
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
                onchange={(e) => {
                    callStore.inputs.midi.id = e.currentTarget.value;
                }}
                class="select select-bordered select-sm w-full"
                disabled={WebMidi.inputs.length === 0}
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
                onchange={(e) => {
                    switch (e.currentTarget.value) {
                        case "drums":
                            soundManager = new DrumSoundManager(midiMappings, midiTriggerTypes);
                            break;
                        case "keyboard":
                            soundManager = new KeyboardSoundManager();
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
</details>
