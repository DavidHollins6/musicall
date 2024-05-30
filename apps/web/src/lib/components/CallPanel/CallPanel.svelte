<script lang="ts">
    import VideoGrid from "$lib/components/Video/VideoGrid.svelte";
    import { getUIStore } from "$lib/store/local/ui.svelte";
    import SidePanel from "./SidePanel.svelte";

    const uiStore = getUIStore();
</script>

<div class={`h-full min-h-full flex`}>
    <div class={`h-full relative ${uiStore.sidePanel ? "w-3/4" : "w-full"} width-transition p-20`}>
        <VideoGrid />
    </div>
    <div class={`h-full width-transition ${uiStore.sidePanel ? "w-1/4" : "w-0"}`}>
        <SidePanel />
    </div>
</div>

<style>
    .width-transition {
        transition-property: width;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
    }
</style>
