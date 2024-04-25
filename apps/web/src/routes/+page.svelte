<script lang="ts">
    import type { PageData } from "./$types";
    let { data } = $props<{ data: PageData }>();

    let callId = $state("");
</script>

<div class="flex items-center flex-col">
    <div class="prose mb-16">
        <h1>Welcome back, David!</h1>
    </div>

    <div class="mt-24 p-12 border rounded-xl bg-base-100 shadow-lg">
        <a href="/call/id" class="btn btn-primary p-8">Join your room</a>
        <a href="/call/id" class="btn btn-primary p-8">Join your room</a>
    </div>
</div>

<!-- <button
    class="absolute right-4 bottom-4 btn btn-primary"
    on:click|preventDefault={() => {
        modalRef.showModal();
    }}
>
    Create Call
</button>

<dialog bind:this={modalRef} class="modal">
    <CreateCall />
</dialog> -->

<!-- <UpcomingCalls /> -->
