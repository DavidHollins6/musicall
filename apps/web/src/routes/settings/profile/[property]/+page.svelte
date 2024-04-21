<script lang="ts">
    import { page } from "$app/stores";
    import type { PageData } from "./$types";
    import PersonalData from "./PersonalData.svelte";

    let { data } = $props<{ data: PageData }>();

    let property = $state("");

    $effect(() => {
        const params = $page.params;
        property = params.property;
    });
</script>

{#if property === "personal"}
    <PersonalData name={data.name} />
{/if}
