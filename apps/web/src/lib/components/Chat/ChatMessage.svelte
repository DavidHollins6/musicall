<script lang="ts">
    const { message, isMyMessage }: { message: string; isMyMessage: boolean } = $props();
</script>

<div class={`flex gap-2 ${isMyMessage ? "flex-row-reverse" : ""}`}>
    <div class="avatar">
        <div class="w-8 h-8 rounded-full">
            <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="" />
        </div>
    </div>
    <div class={`flex flex-col gap-1 ${isMyMessage ? "items-end" : ""}`}>
        <p class="text-xs">
            {#if isMyMessage}
                11:35am, You
            {:else}
                Persons Name, 11:35am
            {/if}
        </p>
        <p
            class={`text-sm rounded-br-xl rounded-bl-xl p-2 ${isMyMessage ? "rounded-tl-xl bg-accent text-accent-content" : "rounded-tr-xl bg-base-200 "}`}
        >
            {message}
        </p>
    </div>
</div>
