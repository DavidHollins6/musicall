<script lang="ts">
    import PasswordInput from "$lib/components/PasswordInput.svelte";
    import type { ActionData } from "./$types";

    let { form }: { form: ActionData } = $props();
</script>

<div class="w-full flex items-center justify-center" style="height: calc(100vh - 66px)">
    <div class="md:w-2/5 prose">
        <h1 class="self-center">Reset Password</h1>
        <form method="post" autocomplete="off">
            <PasswordInput
                passwordError={form?.issues?.find((issue) => issue.path.includes("password"))}
                confirmPasswordError={form?.issues?.find((issue) => issue.path.includes("confirmPassword"))}
            />
            <button class="btn btn-primary mt-4">Reset password</button>
        </form>
    </div>
</div>
