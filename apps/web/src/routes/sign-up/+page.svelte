<!-- // src/routes/login/+page.svelte -->
<script lang="ts">
    import type { ActionData } from "./$types";
    import z from "zod";
    import { debounce } from "$lib/utils/debounce";
    import PasswordInput from "$lib/components/PasswordInput.svelte";

    let { form }: { form: ActionData } = $props();
    const nameError = form?.issues?.find((issue) => issue.path.includes("name"));
    const emailError = form?.issues?.find((issue) => issue.path.includes("email"));
    const passwordError = form?.issues?.find((issue) => issue.path.includes("password"));
    const confirmPasswordError = form?.issues?.find((issue) => issue.path.includes("confirmPassword"));
    let passwordErrors = $state<Array<string>>(["length", "number", "upper", "special"]);

    const clientPasswordChecker = z
        .string()
        .regex(/^.{8,}$/, "length")
        .regex(/.*\d+.*/, "number")
        .regex(/.*[A-Z].*/, "upper")
        .regex(/.*[@$!%*?&].*/, "special");

    const checkPassword = debounce((string: string) => {
        const result = clientPasswordChecker.safeParse(string);
        if (!result.success) {
            passwordErrors = result.error?.issues.map((iss) => iss.message);
        } else {
            passwordErrors = [];
        }
    }, 50);
</script>

<div class="w-full flex">
    <div class="w-full h-full flex justify-center md:m-0 mt-8">
        <form
            method="post"
            class="flex flex-col md:w-2/5 w-full md:mt-16 md:mb-16 md:m-0 m-8 gap-4 prose"
            autocomplete="off"
        >
            <h1 class="self-center">Sign Up</h1>
            <label>
                <div class="label">
                    <span class="label-text">Name</span>
                    {#if nameError}
                        <span class="label-text-alt text-error">{nameError.message}</span>
                    {/if}
                </div>
                <div class={`input input-bordered flex items-center ${nameError ? "input-error" : ""}`}>
                    <input name="name" type="name" class="grow" />
                </div>
            </label>
            <label>
                <div class="label">
                    <span class="label-text">Email</span>
                    {#if emailError}
                        <span class="label-text-alt text-error">{emailError.message}</span>
                    {/if}
                </div>
                <div class={`input input-bordered flex items-center  ${emailError ? "input-error" : ""}`}>
                    <input name="email" type="text" class="grow" value={form?.email} />
                </div>
            </label>
            <PasswordInput {passwordError} {confirmPasswordError} />

            <button class="btn btn-primary mt-4">Sign up</button>
        </form>
    </div>
</div>

<style>
    input:autofill {
        background: unset;
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
