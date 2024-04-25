<script lang="ts">
    import { onMount } from "svelte";
    import { WebMidi } from "webmidi";
    import { page } from "$app/stores";
    import PartySocket from "partysocket";
    import { provider } from "$lib/store/synced/call";
    import { createSocketStore } from "$lib/store/local/socket.svelte";

    const { children } = $props();

    let loadedWebMidi = $state(false);
    const roomId = $page.url.searchParams.get("roomId");

    onMount(() => {
        createSocketStore({
            socket: new PartySocket({
                host: "localhost:1999", // or https://musicall.davidhollins6.partykit.dev in prod
                room: roomId as string,
            }),
        });

        provider.connect();
    });

    onMount(() => {
        WebMidi.enable()
            .then(() => {
                loadedWebMidi = true;
                console.log(WebMidi.inputs);
            })
            .catch((err) => alert(err));
    });
</script>

{#if loadedWebMidi && roomId !== null}
    {@render children()}
{/if}
