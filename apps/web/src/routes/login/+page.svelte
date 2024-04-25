<script lang="ts">
    import { superForm } from "sveltekit-superforms";
    import { clsx } from "clsx";

    let { data: loadData, form } = $props();

    const { form: loginForm } = superForm(loadData.form);

    const emailErrors = form?.form.errors.email;
    const passwordErrors = form?.form.errors.password;
</script>

<div class="w-full flex" style="height: calc(100vh - 66px)">
    <div class="w-full h-full flex justify-center md:m-0 mt-8 md:items-center">
        <form method="post" class="flex flex-col md:w-2/5 w-full md:m-0 m-8 gap-4 prose">
            <h1>Login</h1>
            <label>
                <div class="label">
                    <span class="label-text">Email</span>
                </div>
                <div class={clsx("input", "input-bordered", "flex", "items-center", emailErrors && "input-error")}>
                    <input
                        name="email"
                        type="text"
                        class="grow"
                        bind:value={$loginForm.email}
                        aria-invalid={!!emailErrors}
                        aria-describedby="email-error"
                    />
                </div>
                {#if emailErrors}
                    {#each emailErrors as error}
                        <div class="label">
                            <span id="email-error" class="label-text-alt text-error">{error}</span>
                        </div>
                    {/each}
                {/if}
            </label>

            <label>
                <div class="label">
                    <span class="label-text">Password</span>
                </div>
                <div class={clsx("input", "input-bordered", "flex", "items-center", passwordErrors && "input-error")}>
                    <input
                        name="password"
                        type="password"
                        class="grow"
                        aria-invalid={!!passwordErrors}
                        aria-describedby="password-error"
                    />
                </div>
                {#if passwordErrors}
                    {#each passwordErrors as error}
                        <div class="label">
                            <span id="password-error" class="label-text-alt text-error">{error}</span>
                        </div>
                    {/each}
                {/if}
            </label>
            {#if form?.invalidCredentials}<p class="text-error">Invalid credentials</p>{/if}
            <div class="flex flex-col gap-2">
                <div class="flex justify-between">
                    <a href="/sign-up">Create an account</a>

                    <a class="link" href="/forgot-password">Forgot password?</a>
                </div>
                <!-- TODO: Implement a "Remember Me" checkbox -->
                <button class="btn btn-primary">Login</button>
            </div>
        </form>
    </div>
</div>
