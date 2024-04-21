<script lang="ts">
    import CallCard from "./CallCard.svelte";
    import CreateCall from "./CreateCall.svelte";

    let modalRef: HTMLDialogElement;
</script>

<div class="flex flex-col overflow-y-hidden max-h-full relative">
    <div class="prose p-4 border border-b-base-200">
        <h2>Upcoming Calls</h2>
    </div>
    <!-- <div class="absolute right-0 top-0 m-4">
        <button
            class="btn btn-primary btn-sm"
            on:click|preventDefault={() => {
                modalRef.showModal();
            }}>+</button
        >
    </div> -->
    <div class="flex flex-col gap-8 p-4 grow overflow-y-auto">
        <div>
            <h3 class="text-xl mb-2">Today</h3>
            <ul class="gap-4 flex flex-col">
                <CallCard
                    time="10:00 AM"
                    notes="Samba time, check on Rock School progress adding more longer stuff to make this padded out to test how well it handles longer notes"
                    name="John Doe"
                />
                <CallCard time="11:00 AM" name="Jane Doe" />
                <CallCard time="12:00 AM" name="Bob Smith" />
            </ul>
        </div>
        <div>
            <h3 class="text-xl mb-2">Tomorrow</h3>
            <ul class="gap-4 flex flex-col">
                <CallCard time="10:00 AM" notes="not again..." name="John Doe" />
                <CallCard time="11:00 AM" name="Jane Doe" />
                <CallCard time="12:00 AM" name="Bob Smith" />
            </ul>
        </div>
        <div>
            <h3 class="text-xl mb-2">Monday 1st April</h3>
            <ul class="gap-4 flex flex-col">
                <CallCard time="10:00 AM" name="John Doe" />
                <CallCard time="11:00 AM" name="Jane Doe" />
                <CallCard time="12:00 AM" name="Bob Smith" />
            </ul>
        </div>
        <div>
            <h3 class="text-xl mb-2">Tuesday 2nd April</h3>
            <ul class="gap-4 flex flex-col">
                <CallCard time="10:00 AM" name="John Doe" />
                <CallCard time="11:00 AM" name="Jane Doe" />
                <CallCard time="12:00 AM" name="Bob Smith" />
            </ul>
        </div>
    </div>
</div>

<dialog bind:this={modalRef} class="modal">
    <CreateCall />
</dialog>
