<script lang="ts">
	import type { PDFDocumentProxy } from "pdfjs-dist";
	import { ChevronDown, ChevronUp, Expand, Loader2, RotateCw, Search } from "lucide-svelte";
	import Button from "$components/ui/button/button.svelte";
	import { Input } from "$components/ui/input";
	import * as Dropdown from "$components/ui/dropdown-menu";
	import * as Dialog from "$components/ui/dialog";
	import PDFCanvas from "$components/PDFCanvas.svelte";
	import { extractFileNameCloudinary } from "$lib/utils";

	export let url: string;
	export let name: string;

	let totalPages: number | null = null;
	let pageNumber = 1;
	let scale = 1;
	let rotation: number = 0;
	let isOpen = false;

	const minScale = 1.0;
	const maxScale = 3;

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.value === "") return;
		const value = parseInt(target.value.replace(/\D/g, ""));
		if (!isNaN(value) && value > 0) {
			pageNumber = value;
		}
	}

	function zoom(newScale: number) {
		if (newScale > maxScale) {
			scale = maxScale;
			return;
		}
		if (newScale < minScale) {
			scale = minScale;
			return;
		}
		scale = newScale;
	}

	function onPDFLoad(pdf: PDFDocumentProxy | null) {
		if (pdf) {
			totalPages = pdf.numPages;
		}
	}
</script>

<div class="w-full bg-white rounded-md shadow flex flex-col items-center">
	<div class="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
		<div class="flex items-center gap-1.5">
			<Button
				disabled={pageNumber === 1}
				on:click={() => {
					if (pageNumber - 1 > 0) pageNumber -= 1;
				}}
				variant="ghost"
				aria-label="previous page"
			>
				<ChevronUp class="h-4 w-4 -rotate-90" />
			</Button>
			<div class="flex items-center gap-1.5">
				<Input
					class="w-12 h-8 invalid:focus-visible:ring-red-500"
					pattern="[0-9]+"
					value={pageNumber}
					on:change={(e) => {
						handleChange(e);
					}}
				/>
				<p class="text-zinc-700 text-sm space-x-1">
					<span>/</span>
					<span>{totalPages ? totalPages : "x"}</span>
				</p>
			</div>
			<Button
				on:click={() => {
					if (totalPages && pageNumber + 1 <= totalPages) pageNumber += 1;
				}}
				disabled={!totalPages || pageNumber === totalPages}
				variant="ghost"
				aria-label="next page"
			>
				<ChevronUp class="h-4 w-4 rotate-90" />
			</Button>
		</div>
		<div class="space-x-2">
			<Dropdown.Root>
				<Dropdown.Trigger>
					<Button class="gap-1.5" aria-label="zoom" variant="ghost">
						<Search class="h-4 w-4" />
						<span>{scale * 100}%</span>
						<ChevronDown class="h-3 w-3 opacity-50" />
					</Button>
				</Dropdown.Trigger>
				<Dropdown.Content>
					<Dropdown.Item
						on:click={() => {
							zoom(1);
						}}
					>
						100%
					</Dropdown.Item>
					<Dropdown.Item
						on:click={() => {
							scale = 1.5;
						}}
					>
						150%
					</Dropdown.Item>
					<Dropdown.Item
						on:click={() => {
							scale = 2;
						}}
					>
						200%
					</Dropdown.Item>
					<Dropdown.Item
						on:click={() => {
							scale = 2.5;
						}}
					>
						250%
					</Dropdown.Item>
				</Dropdown.Content>
			</Dropdown.Root>
			<Button
				variant="ghost"
				on:click={() => {
					rotation += 90;
				}}
			>
				<RotateCw class="h-4 w-4" />
			</Button>
			<Dialog.Root
				open={isOpen}
				onOpenChange={(visible) => {
					if (!visible) {
						isOpen = visible;
					}
				}}
			>
				<Dialog.Trigger
					on:click={() => {
						isOpen = true;
					}}
				>
					<Button variant="ghost" class="gap-1.5" aria-label="fullscreen">
						<Expand class="h-4 w-4" />
					</Button>
				</Dialog.Trigger>
				<Dialog.Content class="max-w-[95%] p-0 gap-0">
					<Dialog.Header>
						<Dialog.Title class="text-center py-5 border-b border-zinc-300"
							>{extractFileNameCloudinary(name)}</Dialog.Title
						>
					</Dialog.Header>
					<div
						class="w-full bg-white relative grid place-items-center overflow-auto h-[calc(100vh-5rem)] scrollbar-custom"
					>
						<PDFCanvas
							{minScale}
							{maxScale}
							{url}
							{scale}
							{rotation}
							{pageNumber}
							{onPDFLoad}
							multiple={true}
						/>
					</div>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</div>
	<div
		class="grow-0 w-full bg-white relative grid place-items-center overflow-auto h-[calc(100vh-10rem)] scrollbar-custom"
	>
		<PDFCanvas {minScale} {maxScale} {url} {scale} {rotation} {pageNumber} {onPDFLoad} />
	</div>
</div>
