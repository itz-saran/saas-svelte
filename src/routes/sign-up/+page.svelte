<script lang="ts">
	import { PUBLIC_AFTER_SIGN_UP_URL } from "$env/static/public";
	import SignUp from "clerk-sveltekit/client/SignUp.svelte";
</script>

<div>
	<SignUp redirectUrl={PUBLIC_AFTER_SIGN_UP_URL} />
</div>

<style>
	div {
		width: 100%;
		flex-grow: 1;
		display: grid;
		place-content: center;
	}
</style>
