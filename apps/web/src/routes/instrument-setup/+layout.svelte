<script lang="ts">
    import { onMount } from "svelte";
    import { WebMidi, type Input } from "webmidi";
    let loadedWebMidi = $state(false);

    onMount(() => {
        WebMidi.enable()
            .then(() => {
                loadedWebMidi = true;
                console.log(WebMidi.inputs);
            })
            .catch((err) => alert(err));
    });
</script>

<div class="h-full flex flex-row responsive">
    <div class="border-r border-solid w-1/5 h-full">
        <ul class="steps steps-vertical">
            <li class={`step step-primary`}>Select Instrument</li>
            <li class={`step step-primary`}>Setup Triggers</li>
            <li class={`step step-primary`}>Customise</li>
        </ul>
    </div>
    <div class="w-4/5">
        {#if loadedWebMidi}
            <slot />
        {/if}
    </div>
    <div class="absolute right-4 bottom-4">
        <!-- <div class="join">
            <button
                disabled={step === 0}
                class={`btn btn-lg join-item ${step === 1 ? "btn-disabled" : ""}`}
                on:click={() => {
                    step = Math.max(0, step - 1);
                }}>Previous</button
            >
            <button
                class="btn btn-lg btn-primary join-item"
                on:click={() => {
                    step++;
                }}>{step === 3 ? "Done" : "Next"}</button
            >
        </div> -->
    </div>
</div>
