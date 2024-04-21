<script lang="ts">
    import DrumsIcon from "~icons/game-icons/drum-kit";

    let { time, name, notes } = $props<{ time: string; name: string; notes?: string }>();
</script>

<li>
    <div class="flex flex-col gap-4 border border-base-200 rounded-xl p-4 relative">
        <div class="absolute top-0 right-0 bg-neutral-100 rounded-tr-xl rounded-bl-xl p-2 text-xl">{time}</div>
        <div class="text-xl flex"><DrumsIcon class="mr-2" /> {name}</div>
        {#if notes}
            <div class="prose text-sm">{notes}</div>
        {/if}

        <div class="justify-end join">
            <a href="/call/edit/id" class="btn btn-secondary btn-sm join-item">Edit</a>
            <a href="/call/id" class="btn btn-primary btn-sm join-item">Join</a>
        </div>
    </div>
</li>
