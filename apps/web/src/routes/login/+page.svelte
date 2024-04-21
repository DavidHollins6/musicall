<script lang="ts">
    import type { ActionData } from "./$types";

    let { form } = $props<{ form: ActionData }>();
</script>

<div class="w-full flex" style="height: calc(100vh - 66px)">
    <div class="w-full h-full flex justify-center md:m-0 mt-8 md:items-center">
        <form method="post" class="flex flex-col md:w-2/5 w-full md:m-0 m-8 gap-4 prose">
            <!-- TODO: Add logo -->
            <h1>Login</h1>
            <label>
                <div class="label">
                    <span class="label-text">Email</span>
                </div>
                <div class={`input input-bordered flex items-center ${form?.emailMissing ? "input-error" : ""}`}>
                    <input name="email" type="text" class="grow" value={form?.email} />
                </div>
            </label>

            <label>
                <div class="label">
                    <span class="label-text">Password</span>
                </div>
                <div class={`input input-bordered flex items-center ${form?.passwordMissing ? "input-error" : ""}`}>
                    <input name="password" type="password" class="grow" />
                </div>
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

<style>
    input:autofill {
        background: unset; /* or any other */
    }

    .blur {
        filter: blur(8px);
        -webkit-filter: blur(8px);

        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }

    .hero {
        background-image: url($lib/assets/images/drummer.jpg);
    }
</style>
