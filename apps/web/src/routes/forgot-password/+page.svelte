<script lang="ts">
    import type { ActionData } from "./$types";

    let { form }: { form: ActionData } = $props();
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
                <div
                    class={`input input-bordered flex items-center ${form?.emailMissing || form?.invalidEmail ? "input-error" : ""}`}
                >
                    <input name="email" type="text" class="grow" />
                </div>
            </label>
            {#if form?.emailMissing}<p class="text-error">Please provide an email</p>{/if}
            {#if form?.invalidEmail}<p class="text-error">Email is invalid</p>{/if}
            <button class="btn btn-primary mt-4">Send link to email</button>
        </form>
    </div>
</div>
