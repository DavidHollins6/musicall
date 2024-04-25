<script lang="ts">
    import { svelteStore } from "$lib/utils/CallSyncedStore";
</script>

{#each $svelteStore.todos as todo}
    {todo.title}
{/each}

<button
    on:click|preventDefault={() => {
        $svelteStore.todos.push({
            title: "a title lol",
            completed: false,
        });
    }}
>
    hi button
</button>
