<script lang="ts">
    import Drawer from "$lib/components/CallBar/Drawer.svelte";
    import MidiToggle from "$lib/components/CallBar/MidiToggle.svelte";
    import MicToggle from "$lib/components/CallBar/MicToggle.svelte";
    import CameraToggle from "$lib/components/CallBar/CameraToggle.svelte";
    import LeaveButton from "$lib/components/CallBar/LeaveButton.svelte";
    import type { ISoundManager } from "$lib/soundManager/ISoundManager";
    import type { Mapping, TriggerType } from "$lib/db/schema";

    let {
        soundManager,
        midiMappings,
        midiTriggerTypes,
    }: { soundManager: ISoundManager; midiMappings: Mapping[]; midiTriggerTypes: TriggerType[] } = $props();
</script>

<div class="w-full justify-center flex p-4 gap-4">
    <Drawer {soundManager} {midiMappings} {midiTriggerTypes} />
    <MidiToggle />
    <MicToggle />
    <CameraToggle />
    <LeaveButton />
</div>
