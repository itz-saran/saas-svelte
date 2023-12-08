<script lang="ts">
	import { page } from "$app/stores";
</script>

<div class="grow grid place-content-center">
	<h1 class="font-semibold text-2xl">{$page.status}: {$page.error?.message}</h1>
</div>
