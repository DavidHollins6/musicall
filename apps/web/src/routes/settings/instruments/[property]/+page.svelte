<script lang="ts">
    import { onMount } from "svelte";
    import type { PageData } from "../../../$types";
    import { page } from "$app/stores";

    let property = $state("");
    let { data } = $props<{ data: PageData }>();

    $effect(() => {
        const params = $page.params;
        property = params.property;
    });

    onMount(async () => {
        const user = await data.supabase.auth.getUser();
        console.log(user.data.user?.user_metadata);
    });
</script>
