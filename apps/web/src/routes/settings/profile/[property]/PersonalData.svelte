<script lang="ts">
    let { name } = $props<{ name: string }>();
</script>

<div class="ml-16 mt-8">
    <form method="POST">
        <label class="form-control w-full max-w-xs">
            <div class="label">
                <span class="label-text">Name</span>
            </div>
            <input
                type="text"
                name="name"
                value={name}
                placeholder="Type here"
                class="input input-bordered w-full max-w-xs"
            />
        </label>

        <button class="btn btn-primary mt-4">Submit</button>
    </form>
</div>
