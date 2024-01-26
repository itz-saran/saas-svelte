<script lang="ts">
	import ChatInput from "$components/chat/ChatInput.svelte";
	import Messages from "$components/chat/Messages.svelte";
	import { ChevronLeft, Loader2, XCircle } from "lucide-svelte";
	import type { File } from "$lib/types";
	import { buttonVariants } from "$components/ui/button";

	export let file: File;

	$: isLoading = !(file.uploadStatus === "FAILED" || file.uploadStatus === "SUCCESS");
</script>

{#if file.uploadStatus === "PROCESSING"}
	<div
		class="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2"
	>
		<div class="flex-1 flex justify-center items-center flex-col mb-28">
			<div class="flex flex-col items-center gap-2">
				<Loader2 class="h-8 w-8 text-blue-500 animate-spin" />
				<h3 class="font-semibold text-xl">Processing PDF...</h3>
				<p class="text-sm text-zinc-500">This won't take long.</p>
			</div>
		</div>
		<ChatInput isDisabled />
	</div>
{/if}

{#if file.uploadStatus === "FAILED"}
	<div
		class="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2"
	>
		<div class="flex-1 flex justify-center items-center flex-col mb-28">
			<div class="flex flex-col items-center gap-2">
				<XCircle class="h-8 w-8 text-red-500" />
				<h3 class="font-semibold text-xl">Too many pages</h3>
				<p class="text-sm text-zinc-500">
					Your <span class="font-semibold">free</span> plan supports upto 5 pages.
				</p>
				<a
					href="/dashboard"
					class={buttonVariants({
						variant: "secondary",
						class: "mt-4",
					})}
				>
					<ChevronLeft class="h-3 w-3 mr-1.5" />Back
				</a>
			</div>
		</div>
		<ChatInput isDisabled />
	</div>
{/if}

{#if isLoading}
	<div
		class="relative min-h-[calc(100vh-3.5rem)] lg:min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2"
	>
		<div class="flex-1 flex justify-center items-center flex-col mb-28">
			<div class="flex flex-col items-center gap-2">
				<Loader2 class="h-8 w-8 text-blue-500 animate-spin" />
				<h3 class="font-semibold text-xl">Loading...</h3>
				<p class="text-sm text-zinc-500">We're preparing your pdf.</p>
			</div>
		</div>
		<ChatInput isDisabled />
	</div>
{/if}

{#if file.uploadStatus === "SUCCESS" && !isLoading}
	<div
		class="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2"
	>
		<div class="flex-1 justify-between flex flex-col mb-28">
			<Messages />
		</div>
		<ChatInput fileId={file.id} />
	</div>
{/if}
