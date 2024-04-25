<script lang="ts">
    import CameraIcon from "~icons/mdi/camera";
    import CameraOffIcon from "~icons/mdi/camera-off";
</script>

<button
    on:click={async () => {
        await callStore.peerConnection.toggleCamera(!callStore.isVideoEnabled);
        callStore.isVideoEnabled = !callStore.isVideoEnabled;
    }}
    class={`btn btn-square text-2xl ${callStore.isVideoEnabled ? "btn-success" : "btn-warning"}`}
>
    {#if callStore.isVideoEnabled}
        <CameraIcon />
    {:else}
        <CameraOffIcon />
    {/if}
</button>
