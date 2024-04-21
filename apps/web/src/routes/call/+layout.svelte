<script lang="ts">
    import { onMount } from "svelte";
    import { WebMidi } from "webmidi";
    import { page } from "$app/stores";

    let loadedWebMidi = $state(false);
    const callId = $page.url.searchParams.get("roomId");

    onMount(() => {
        WebMidi.enable()
            .then(() => {
                loadedWebMidi = true;
                console.log(WebMidi.inputs);
            })
            .catch((err) => alert(err));
    });
</script>

{#if loadedWebMidi && callId !== null}
    <slot />
{/if}
