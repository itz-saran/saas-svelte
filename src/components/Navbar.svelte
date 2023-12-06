<script>
	import MaxWidthWrapper from "$components/MaxWidthWrapper.svelte";
	import { buttonVariants } from "$components/ui/button";
	import { ArrowRight } from "lucide-svelte";
	import UserButton from 'clerk-sveltekit/client/UserButton.svelte'
	import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte'
</script>

<nav
	class="sticky h-14 inset-x-0 top-0 z-50 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all"
>
	<MaxWidthWrapper>
		<div class="flex h-14 items-center justify-between border-b border-zinc-200">
			<a href="/" class="flex Z-60 font-semibold">
				<span>sparrow.</span>
			</a>

			<!-- TODO: Add mobile navbar -->

			<div class="hidden items-center space-x-4 sm:flex">
				<a
					href="/pricing"
					class={buttonVariants({
						variant: "ghost",
						size: "sm",
					})}
				>
					Pricing
				</a>
				<a
					href="/sign-in"
					class={buttonVariants({
						variant: "ghost",
						size: "sm",
					})}
				>
					Sign in
				</a>
				<a
					href="/sign-up"
					class={buttonVariants({
						size: "sm",
					})}
				>
					Get started
					<ArrowRight class="ml-1.5 h-5 w-5" />
				</a>

				<SignedIn>
					<UserButton afterSignOutUrl="/" />
				</SignedIn>
			</div>
		</div>
	</MaxWidthWrapper>
</nav>
