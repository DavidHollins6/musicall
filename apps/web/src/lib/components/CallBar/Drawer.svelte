<script lang="ts">
    import MenuIcon from "~icons/mdi/dots-vertical";
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
        if (!callStore.peerConnection.checkedUserMediaPermissions) {
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
                    onchange={(e) => {
                        callStore.peerConnection.setVideoInput(e.currentTarget.value);
                    }}
                    class="select select-bordered select-sm w-full"
                    value={callStore.peerConnection.localVideoDeviceId}
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
                        callStore.peerConnection.setAudioInput(e.currentTarget.value);
                    }}
                    class="select select-bordered select-sm w-full"
                    value={callStore.peerConnection.localAudioDeviceId}
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
    </div>
</div>
