<script lang="ts">
	import { Button } from "$components/ui/button";
	import { Textarea } from "$components/ui/textarea";
	import type { EventHelper } from "$lib/types";
	import { useChat } from "ai/svelte";
	import { Send } from "lucide-svelte";

	export let isDisabled: boolean = false;
	export let fileId: string = "";

	let value = "";
	async function handleFormSubmit(e: EventHelper<SubmitEvent, HTMLFormElement>) {
		const response = await fetch("/api/chat", {
			method: "POST",
			body: JSON.stringify({ message: value, fileId }),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
			},
		});
		const jsonData = await response.json();
		console.log({ jsonData });
	}
</script>

<div class="absolute bottom-0 left-0 w-full">
	<form
		class="mx-2 flex flex-row gap-3 md:mx-4 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
		on:submit={handleFormSubmit}
	>
		<div class="relative flex h-full flex-1 items-stretch md:flex-col">
			<div class="relative flex flex-col w-full flex-grow p-4">
				<div class="relative">
					<Textarea
						bind:value
						disabled={isDisabled}
						autoresize
						placeholder="Enter your question..."
						rows={1}
						class="resize-none max-h-24 scrollbar-w-2 scrollbar-track-blue-lighter scrollbar-thumb-blue scrollbar-thumb-rounded"
					/>
					<Button
						disabled={isDisabled}
						type="submit"
						class="absolute right-[8px] p-2 bottom-[3px] leading-none h-auto"
						aria-label="send message"
					>
						<Send class="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	</form>
</div>
