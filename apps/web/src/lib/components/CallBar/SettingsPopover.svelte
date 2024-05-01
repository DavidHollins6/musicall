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
        if (!callStore.webRTCHandler.checkedUserMediaPermissions) {
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

<details class="dropdown dropdown-top dropdown-end">
    <summary class="btn text-2xl shadow-md"><SettingsIcon /></summary>
    <div class="p-4 mb-1 shadow menu dropdown-content z-[1] bg-base-100 w-64 rounded-lg shadow-lg">
        <label class="form-control w-full max-w-xs">
            <div class="label">
                <span class="label-text">Video</span>
            </div>
            <select
                onchange={(e) => {
                    callStore.webRTCHandler.setVideoInput(e.currentTarget.value);
                }}
                class="select select-bordered select-sm w-full"
                value={callStore.webRTCHandler.localVideoDeviceId}
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
                onchange={(e) => {
                    callStore.webRTCHandler.setAudioInput(e.currentTarget.value);
                }}
                class="select select-bordered select-sm w-full"
                value={callStore.webRTCHandler.localAudioDeviceId}
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
                    callStore.selectedMidiInputId = e.currentTarget.value;
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
