<script lang="ts">
	import { PUBLIC_AFTER_SIGN_IN_URL } from "$env/static/public";
	import SignIn from "clerk-sveltekit/client/SignIn.svelte";
</script>

<div>
	<SignIn redirectUrl={PUBLIC_AFTER_SIGN_IN_URL} />
</div>

<style>
	div {
		width: 100%;
		flex-grow: 1;
		display: grid;
		place-content: center;
	}
</style>
