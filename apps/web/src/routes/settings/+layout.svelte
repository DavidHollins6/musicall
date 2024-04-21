<script lang="ts">
    import { onMount } from "svelte";
    import type { PageData } from "../$types";
    import { page } from "$app/stores";
    let property = $state("");

    $effect(() => {
        const params = $page.params;
        property = params.property;
    });

    let { data } = $props<{ data: PageData }>();
    const SECTIONS = [
        { name: "Instruments", value: "instruments", properties: [{ name: "View Instruments", value: "view" }] },
        {
            name: "Calls",
            value: "calls",
            properties: [
                { name: "General", value: "general" },
                { name: "Audio", value: "audio" },
                { name: "Video", value: "video" },
            ],
        },
        {
            name: "Profile",
            value: "profile",
            properties: [
                { name: "Personal Data", value: "personal" },
                { name: "Password Reset", value: "password" },
            ],
        },
    ];

    onMount(async () => {
        const user = await data.supabase.auth.getUser();
        console.log(user.data.user?.user_metadata);
    });
</script>

<div style="height: calc(100% - 66px)" class="flex flex-row responsive">
    <div class="border-r border-solid w-1/5 h-full bg-base-200">
        <ul class="menu">
            {#each SECTIONS as section}
                <li>
                    <h2 class="menu-title">{section.name}</h2>
                    <ul>
                        {#each section.properties as sectionProperty}
                            <li>
                                <a
                                    class={sectionProperty.value === property ? "active" : ""}
                                    href={`/settings/${section.value}/${sectionProperty.value}`}
                                    >{sectionProperty.name}</a
                                >
                            </li>
                        {/each}
                    </ul>
                </li>{/each}
        </ul>
    </div>
    <div class="w-4/5">
        <slot />
    </div>
</div>
