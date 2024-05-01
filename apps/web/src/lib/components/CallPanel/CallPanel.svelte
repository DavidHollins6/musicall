<script lang="ts">
    import VideoGrid from "$lib/components/Video/VideoGrid.svelte";
    import { getCallStore } from "$lib/store/local/call.svelte";
    import SidePanel from "./SidePanel.svelte";

    const callStore = getCallStore();
</script>

<div class={`h-full min-h-full flex`}>
    <div class={`h-full relative ${callStore.isSidePanelOpen ? "w-3/4" : "w-full"} width-transition p-20`}>
        <VideoGrid />
    </div>
    <div class={`h-full width-transition ${callStore.isSidePanelOpen ? "w-1/4" : "w-0"}`}>
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
