<script lang="ts">
	import type { PageData } from "./$types";
	import UploadButton from "$components/UploadButton.svelte";
	import { Ghost } from "lucide-svelte";
	import Skeleton from "$components/Skeleton.svelte";
	import { Plus, MessageSquare, Trash, Loader2 } from "lucide-svelte";
	import { format } from "date-fns";
	import Button from "$components/ui/button/button.svelte";
	import { invalidate } from "$app/navigation";
	import { toast } from "svelte-french-toast";
	import { extractFileNameCloudinary } from "$lib/utils";

	export let data: PageData;
	let currentlyDeleting: string | null = null;

	async function deleteFile(fileId: string) {
		try {
			currentlyDeleting = fileId;
			const response = await fetch("/api/files", {
				method: "delete",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ fileId }),
			});
			// const data = await response.json();
			toast.success("File deleted successfully.");
			// ? Invalidate the current file data so the page loads new data
			invalidate("file-list-data");
		} catch (error) {
			toast.error("Something went wrong, please try again.");
		}

		currentlyDeleting = null;
	}
</script>

<main class="mx-auto max-w-7xl px-5 md:p-10 w-full">
	<div
		class="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0"
	>
		<h1 class="mb-3 font-bold text-5xl text-gray-900">My Files</h1>

		<UploadButton />
	</div>
	{#await data.streaming.files}
		<Skeleton count={3} className="box" />
	{:then files}
		{#if files && files.length !== 0}
			<ul
				class="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3"
			>
				{#each files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as file (file.id)}
					<li
						class="colspan-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
					>
						<a href={`/dashboard/${file.key}`} class="flex flex-col gap-2">
							<div class="pt-6 px-6 flex w-full items-center justify-between space-x-6">
								<div
									class="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
								/>
								<div class="flex-1 truncate">
									<div class="flex items-center space-x-3">
										<h3 class="truncate text-lg font-medium text-zinc-900">
											{extractFileNameCloudinary(file.name)}
										</h3>
									</div>
								</div>
							</div>
						</a>
						<div
							class="px-6 py-3 mt-4 flex justify-between flex-col xs:flex-row gap-y-6 xs:gap-y-0 xs:place-items-center xs:py-2 text-xs text-zinc-500"
						>
							<div class="flex items-center gap-2">
								<Plus class="h-4 w-4 shrink-0" />
								<span class="xs:whitespace-pre">{format(file.createdAt, "dd-MM-yyyy hh:mm")}</span>
							</div>
							<div class="grow grid gap-y-6 xs:gap-y-0 xs:grid-cols-2 xs:place-items-center">
								<div class="flex items-center gap-2">
									<MessageSquare class="h-4 w-4" />
									11
								</div>
								<Button
									class="shrink-0"
									disabled={currentlyDeleting === file.id}
									on:click={() => {
										deleteFile(file.id);
									}}
									variant="destructive"
								>
									{#if currentlyDeleting === file.id}
										<Loader2 size={16} class="animate-spin" />
									{:else}
										<Trash size={16} class="w-full" />
									{/if}
								</Button>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			<div class="mt-16 flex flex-col items-center gap-2">
				<Ghost class="h-8 w-8 text-zinc-800" />
				<h3 class="font-semibold text-xl">Pretty empty around here</h3>
				<p>Let's upload your first PDF.</p>
			</div>
		{/if}
	{/await}
</main>

<style>
	:global(.box) {
		height: 100px;
		width: 100%;
		margin: 10px 0;
	}
</style>
