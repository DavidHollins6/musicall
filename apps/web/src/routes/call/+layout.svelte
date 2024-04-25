<script lang="ts">
    import { onMount, setContext } from "svelte";
    import { WebMidi } from "webmidi";
    import { page } from "$app/stores";
    import createSocketState from "./createSocketState.svelte";
    import PartySocket from "partysocket";
    import { provider } from "$lib/utils/CallSyncedStore";

    let loadedWebMidi = $state(false);
    const roomId = $page.url.searchParams.get("roomId");

    onMount(() => {
        let socketState = createSocketState({
            socket: new PartySocket({
                host: "localhost:1999", // or https://musicall.davidhollins6.partykit.dev in prod
                room: roomId as string,
            }),
        });

        setContext("socket", socketState);
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
    <slot />
{/if}
