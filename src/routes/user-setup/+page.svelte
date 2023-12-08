<script lang="ts">
	import { Loader2 } from "lucide-svelte";

	export let data;

	function redirect(node: HTMLAnchorElement) {
		return node.click();
	}
</script>

{#await data.streamed?.isAccountSetup}
	<div class="w-full mt-24 flex justify-center">
		<div class="flex flex-col items-center gap-2">
			<Loader2 class="h-8 w-8 animate-spin text-zinc-800" />
			<h3 class="font-semibold text-xl">Setting up your account...</h3>
		</div>
	</div>
{:then value}
	{#if value}
		<div class="w-full mt-24 flex justify-center">
			<div class="flex flex-col items-center gap-2">
				<Loader2 class="h-8 w-8 animate-spin text-zinc-800" />
				<p>
					You will be redirected automatically to dashboard, if not
					<a href="/dashboard" use:redirect class="underline underline-offset-2"> click here.</a>
				</p>
			</div>
		</div>
	{/if}
{:catch error}
	<div class="w-full mt-24 flex justify-center">
		<div class="flex flex-col items-center gap-2">
			<Loader2 class="h-8 w-8 animate-spin text-zinc-800" />
			<p>Error in setting up your account. Please log out and try again.</p>
		</div>
	</div>
{/await}
