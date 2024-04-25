<script lang="ts">
    import "../app.css";
    import NavBar from "$lib/components/NavBar.svelte";
    import { onMount } from "svelte";
    import { themeChange } from "theme-change";

    let { data, children } = $props();

    onMount(() => {
        themeChange(false);
    });
</script>

<NavBar loggedIn={!!data.user} />

{@render children()}

<style>
    :global([data-theme="light"] .btn-primary) {
        color: #fff !important;
    }
    :global([data-theme="light"] .btn-secondary) {
        color: #fff !important;
    }
</style>
