<script lang="ts">
    import { superForm } from "sveltekit-superforms";

    let { data: loadData, form } = $props();

    const { form: forgottenPasswordForm } = superForm(loadData.form);

    const emailErrors = form?.form?.errors.email;
</script>

<div class="w-full flex items-center justify-center" style="height: calc(100vh - 66px)">
    <div class="p-8 prose">
        <h1 class="self-center">Forgotten Password</h1>
        <p class="mt-2 mb-2">Enter your email and we'll send you a link to reset your password</p>
        <form method="post" autocomplete="off">
            <label>
                <div class="label pl-0">
                    <span class="label-text">Email</span>
                </div>
                <div class={`input input-bordered flex items-center ${emailErrors ? "input-error" : ""}`}>
                    <input
                        name="email"
                        type="text"
                        class="grow"
                        bind:value={$forgottenPasswordForm.email}
                        aria-invalid={!!emailErrors}
                        aria-describedby="email-error"
                    />
                </div>
            </label>
            {#if emailErrors}
                {#each emailErrors as error}
                    <div class="label">
                        <span id="email-error" class="label-text-alt text-error">{error}</span>
                    </div>
                {/each}
            {/if}
            <button class="btn btn-primary mt-4">Send link to email</button>
        </form>
    </div>
</div>
