<script lang="ts">
	import type { EventHelper } from "$lib/types";
	import { Cloud, File as FileIcon } from "lucide-svelte";
	import Progress from "$components/ui/progress/progress.svelte";

	type FileInputOnChangeEvent = EventHelper<Event, HTMLInputElement>;
	type DragAndDropEvent = EventHelper<DragEvent, HTMLButtonElement>;

	let file: File | null = null;
	let isUploading = true;
	let uploadProgress = 0;

	function handleDrop(e: DragAndDropEvent) {
		e.preventDefault();
		e.stopPropagation();

		/**
		 * if the browser supports DataTransferItemList interface, the getAsFile() method is used to
		 * access each file; otherwise the DataTransfer interface's files property is used to access each
		 * file.
		 */
		// ! Accept only only file
		if (e.dataTransfer?.items) {
			const item = e.dataTransfer.items[0];
			if (item.kind === "file") {
				const fileItem = item.getAsFile();
				file = fileItem;
			}
		} else if (e.dataTransfer?.files) {
			file = e.dataTransfer.files[0];
		}

		if (file) {
			uploadFile(file);
		}
	}

	function handleDragOver(e: DragAndDropEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer?.dropEffect) {
			e.dataTransfer.dropEffect = "copy";
		}
	}

	function handleFileChange(e: FileInputOnChangeEvent) {
		e.preventDefault();
		e.stopPropagation();
		const {
			currentTarget: { files },
		} = e;
		if (!files || files.length === 0) {
			return;
		}
		// ! Accept only only file
		file = files[0];

		uploadFile(file);
	}

	function simulateLoading() {
		uploadProgress = 0;
		const intervalId = setInterval(() => {
			if (uploadProgress >= 95) {
				clearInterval(intervalId);
				return;
			}
			uploadProgress += 5;
		}, 500);
	}

	async function uploadFile(fileToUpload: File) {
		simulateLoading();
		const formData = new FormData();
		formData.append("file", fileToUpload);
		try {
			const response = await fetch("/api/files", {
				method: "POST",
				body: formData,
			});
			const data = await response.json();
			console.log({ data });
			uploadProgress = 100;
		} catch (err) {
			console.log("FILE_UPLOAD_ERROR", err);
		}
	}
</script>

<div class="border h-64 m-4 border-dashed border-gray-300 rounded-lg">
	<button
		class="flex item-center justify-center h-full w-full"
		on:dragover={handleDragOver}
		on:drop={handleDrop}
	>
		<label
			for="dropzone-file"
			class="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
		>
			<div class="flex flex-col items-center justify-center pt-5 pb-6">
				<Cloud class="h-6 w-6 text-zinc-500 mb-2" />
				<p class="mb-2 text-sm text-zinc-700">
					<span class="font-semibold"> Click to upload</span> or drag and drop
				</p>
				<p class="text-xs text-zinc-500">PDF (up to 4MB)</p>
			</div>
			<input
				id="dropzone-file"
				type="file"
				on:change={handleFileChange}
				accept="application/pdf"
				class="hidden"
			/>
			{#if file}
				<div
					class="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200"
				>
					<div class="px-3 py-2 h-full grid place-items-center">
						<FileIcon class="h-4 w-4 text-blue-500" />
					</div>
					<div class="px-3 py-2 h-full text-sm truncate">
						{file.name}
					</div>
				</div>
			{/if}

			{#if isUploading}
				<div class="w-full mt-4 max-w-xs mx-auto">
					<Progress value={uploadProgress} class="h-1 w-full bg-zinc-200" />
				</div>
			{/if}
		</label>
	</button>
</div>
