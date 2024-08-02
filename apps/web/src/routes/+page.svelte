<script lang="ts">
    import { getChatMachine } from "$lib/machines/chatMachine";

    const { snapshot, send } = getChatMachine();
</script>

<div class="flex items-center flex-col">
    <div class="prose mb-16">
        <h1>Welcome back, David!</h1>
    </div>

    <button on:click={() => send({ type: "CONNECT" })}>
        {$snapshot.matches("connected") ? "Connected" : "Disconnected"}
    </button>

    {#if $snapshot.matches("connected")}
        <button on:click={() => send({ type: "ADD_MESSAGE", message: "hello lol" })}> Send Message lol </button>
    {/if}

    {#each $snapshot.context.chatMessages as message}
        {message}
    {/each}

    <div class="mt-24 p-12 border rounded-xl bg-base-100 shadow-lg">
        <a href="/call/id" class="btn btn-primary p-8">Join your room</a>
    </div>
</div>
