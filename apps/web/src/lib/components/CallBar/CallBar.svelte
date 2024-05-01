<script lang="ts">
    import MidiToggle from "$lib/components/CallBar/MidiToggle.svelte";
    import MicToggle from "$lib/components/CallBar/MicToggle.svelte";
    import CameraToggle from "$lib/components/CallBar/CameraToggle.svelte";
    import LeaveButton from "$lib/components/CallBar/LeaveButton.svelte";
    import SidePanelToggle from "$lib/components/CallBar/SidePanelToggle.svelte";
    import type { ISoundManager } from "$lib/soundManager/ISoundManager";
    import type { Mapping, TriggerType } from "$lib/db/schema";
    import SettingsPopover from "./SettingsPopover.svelte";

    let {
        soundManager,
        midiMappings,
        midiTriggerTypes,
    }: { soundManager: ISoundManager; midiMappings: Mapping[]; midiTriggerTypes: TriggerType[] } = $props();
</script>

<div class="w-full justify-between flex p-4 4 border-t-neutral-content border-solid border-t">
    <!-- <Drawer {soundManager} {midiMappings} {midiTriggerTypes} /> -->
    <div></div>
    <div class="flex gap-4">
        <SettingsPopover />
        <MidiToggle />
        <MicToggle />
        <CameraToggle />
        <LeaveButton />
    </div>
    <div><SidePanelToggle /></div>
</div>
