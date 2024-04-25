<script lang="ts">
    import MusicNoteIcon from "~icons/mdi/music-note";
    import MusicNoteOffIcon from "~icons/mdi/music-note-off";
    import { getCallStore } from "$lib/store/local/call.svelte";

    const callStore = getCallStore();
</script>

<button
    on:click={() => {
        callStore.isMidiEnabled = !callStore.isMidiEnabled;
    }}
    class={`btn btn-square text-2xl ${callStore.isMidiEnabled ? "btn-success" : "btn-warning"}`}
>
    {#if callStore.isMidiEnabled}
        <MusicNoteIcon />
    {:else}
        <MusicNoteOffIcon />
    {/if}
</button>
