<script lang="ts">
    import MusicNoteIcon from "~icons/mdi/music-note";
    import MusicNoteOffIcon from "~icons/mdi/music-note-off";
    import { getCallStore } from "$lib/store/local/call.svelte";

    const callStore = getCallStore();
</script>

<button
    on:click={() => {
        callStore.inputs.midi.enabled = !callStore.inputs.midi.enabled;
    }}
    class={`btn text-2xl shadow-md ${callStore.inputs.midi.enabled ? "btn-success" : "btn-outline"}`}
>
    {#if callStore.inputs.midi.enabled}
        <MusicNoteIcon />
    {:else}
        <MusicNoteOffIcon />
    {/if}
</button>
