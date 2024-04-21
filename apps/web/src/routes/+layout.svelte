<script lang="ts">
    import "../app.css";
    import NavBar from "$lib/components/NavBar.svelte";
    import { invalidate } from "$app/navigation";
    import { onMount } from "svelte";
    import { themeChange } from "theme-change";

    let { data } = $props();

    onMount(() => {
        const {
            data: { subscription },
        } = data.supabase.auth.onAuthStateChange((event, _session) => {
            if (_session?.expires_at !== data.session?.expires_at) {
                invalidate("supabase:auth");
            }
        });

        themeChange(false);

        return () => subscription.unsubscribe();
    });
</script>

<NavBar loggedIn={!!data.session} />

<slot />

<style>
    :global([data-theme="light"] .btn-primary) {
        color: #fff !important;
    }
    :global([data-theme="light"] .btn-secondary) {
        color: #fff !important;
    }
</style>
