<script lang="ts">
    import { enhance } from "$app/forms";
</script>

<form action="reset-password" method="POST" use:enhance>
    <input type="text" name="old-password" />
    <input type="text" name="new-password" />
</form>
