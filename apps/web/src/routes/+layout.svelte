<script lang="ts">
    import "../app.css";
    import NavBar from "$lib/components/NavBar.svelte";
    import { onMount } from "svelte";
    import { themeChange } from "theme-change";
    import { createChatMachine } from "$lib/machines/chatMachine";

    let { data, children } = $props();

    createChatMachine();

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
