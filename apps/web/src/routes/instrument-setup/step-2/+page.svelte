<script lang="ts">
    import InstrumentTriggerSetup from "$lib/components/Instrument/InstrumentTriggerSetup.svelte";
    import type { PageData } from "./$types";

    const { data } = $props<{ data: PageData }>();
</script>

{#if data.instrument && data.triggers}
    <InstrumentTriggerSetup triggers={data.triggers} instrument={data.instrument} />
{/if}
