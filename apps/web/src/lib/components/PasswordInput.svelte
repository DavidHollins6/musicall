<script lang="ts">
    import { debounce } from "$lib/utils/debounce";
    import EyeIcon from "~icons/mdi/eye";
    import EyeClosedIcon from "~icons/mdi/eye-closed";
    import { z } from "zod";

    let {
        passwordError,
        confirmPasswordError,
    }: {
        passwordError: { message: string } | undefined;
        confirmPasswordError: { message: string } | undefined;
    } = $props();

    let passwordErrors = $state<Array<string>>(["length", "number", "upper", "special"]);
    let passwordStrength = $state<number>(0);
    let showPassword = $state<boolean>(false);

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
            passwordStrength = Math.abs((passwordErrors.length - 4) * 25);
        } else {
            passwordErrors = [];
            passwordStrength = 100;
        }
    }, 50);
</script>

<div class="relative">
    <label class="basis-0 min-w-0 grow">
        <div class="label">
            <span class="label-text">Password</span>
            {#if passwordError}
                <span class="label-text-alt text-error">{passwordError.message}</span>
            {/if}
        </div>
        <div class={`input input-bordered flex items-center  ${passwordError ? "input-error" : ""}`}>
            <input
                name="password"
                type={showPassword ? "text" : "password"}
                class="grow"
                autocomplete="new-password"
                oninput={(e) => {
                    checkPassword(e.currentTarget.value);
                }}
            />
        </div>
    </label>
    <button
        class="btn btn-neutral btn-square absolute right-0 md:-right-16 bottom-0"
        onclick={(e) => {
            e.preventDefault();
            showPassword = !showPassword;
        }}
    >
        {#if showPassword}
            <EyeClosedIcon />
        {:else}
            <EyeIcon />
        {/if}
    </button>
</div>
<div class="flex flex-col gap-2 mt-2">
    <span class="label-text">Password Strength</span>
    <progress
        class={`progress ${passwordStrength === 100 ? "progress-success" : passwordStrength <= 25 ? "progress-error" : "progress-warning"} w-full`}
        value={passwordStrength}
        max="100"
    ></progress>
    <span class="label-text-alt self-end">
        {#if passwordStrength === 100}
            Excellent
        {:else if passwordStrength >= 75}
            Strong
        {:else if passwordStrength >= 50}
            Okay
        {:else}
            Weak
        {/if}</span
    >
</div>
<!-- <ul class="m-0 mt-2 text-xs">
    <li class={`${passwordErrors.includes("length") ? "text-error" : "text-success"}`}>Minimum of 8 characters</li>
    <li class={`${passwordErrors.includes("upper") ? "text-error" : "text-success"}`}>
        Contain at least 1 uppercase letter
    </li>
    <li class={`${passwordErrors.includes("special") ? "text-error" : "text-success"}`}>
        Contain at least 1 special character
    </li>
    <li class={`${passwordErrors.includes("number") ? "text-error" : "text-success"}`}>Contain at least 1 number</li>
</ul> -->

<label class="basis-0 min-w-0 grow">
    <div class="label">
        <span class="label-text">Confirm Password</span>
        {#if confirmPasswordError}
            <span class="label-text-alt text-error">{confirmPasswordError.message}</span>
        {/if}
    </div>
    <div class={`input input-bordered flex items-center  ${confirmPasswordError ? "input-error" : ""}`}>
        <input name="confirmPassword" autocomplete="off" type="password" class="grow" />
    </div>
</label>
