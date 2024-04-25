<script lang="ts">
    const { loggedIn }: { loggedIn: boolean } = $props();
    import SunIcon from "~icons/mdi/white-balance-sunny";
    import MoonIcon from "~icons/mdi/weather-night";
</script>

<div class="navbar z-40">
    <div class="flex-1">
        <a href="/" class="btn btn-ghost text-xl">Musicall</a>
    </div>
    <div class="flex-none">
        <label class="flex cursor-pointer gap-2 mr-8">
            <SunIcon />
            <input
                type="checkbox"
                value="forest"
                class="toggle theme-controller toggle-sm"
                data-toggle-theme="forest,light"
                data-act-class="ACTIVECLASS"
            />
            <MoonIcon />
        </label>
        <div class="mr-2">
            {#if loggedIn}
                <div class="dropdown dropdown-end">
                    <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                        <div class="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                            />
                        </div>
                    </div>
                    <ul
                        tabindex="0"
                        class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                    >
                        <li>
                            <a href="/profile" class="justify-between"> Profile </a>
                        </li>
                        <li><a href="/settings">Settings</a></li>
                        <li><a href="/logout">Logout</a></li>
                    </ul>
                </div>
            {:else}
                <a href="/login" class="btn btn-primary btn-sm">Login</a>
            {/if}
        </div>
    </div>
</div>
