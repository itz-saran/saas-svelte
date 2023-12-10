<script lang="ts">
	import type { File } from "$lib/types";
	import { ChevronDown, ChevronUp, Loader2, Search } from "lucide-svelte";
	import type { PDFDocumentProxy } from "pdfjs-dist";
	import * as pdfjs from "pdfjs-dist";
	import toast from "svelte-french-toast";
	//@ts-ignore
	import pdfjsWorker from "pdfjs-dist/build/pdf.worker.js";
	import Button from "$components/ui/button/button.svelte";
	import { Input } from "$components/ui/input";
	import { Root, Trigger, Content, Item } from "$components/ui/dropdown-menu";

	pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

	export let file: File;
	let pdfDoc: PDFDocumentProxy | null = null;
	let pageNumber = 1;
	let totalPages: number | null = null;
	let pagePending = false;
	let isPageRendering = false;
	let scale = 2;
	let canvasElement: HTMLCanvasElement;
	// Get the document load function ready
	const loadingTask = pdfjs.getDocument(file.url).promise;

	$: if (canvasElement && totalPages && pageNumber > 0 && pageNumber < totalPages) {
		loadPDF(canvasElement, { pageNumber, scale });
	}

	const minScale = 1.0;
	const maxScale = 3;

	function debounce(this: any, func: any, timeout = 300) {
		let timer: NodeJS.Timeout;
		return (...args: any) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				func.apply(this, args);
			}, timeout);
		};
	}

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.value === "") return;
		const value = parseInt(target.value.replace(/\D/g, ""));
		if (!isNaN(value)) {
			pageNumber = value;
		}
	}

	async function asyncLoad(
		node: HTMLCanvasElement,
		{ pageNumber = 1, scale = minScale }: { pageNumber?: number; scale?: number },
	) {
		// Resolve document from loadingTask and render page in canvas
		pdfDoc = await loadingTask;
		totalPages = pdfDoc.numPages;
		const page = await pdfDoc.getPage(pageNumber);
		const viewport = page.getViewport({ scale: scale <= maxScale ? scale : maxScale });
		const canvas = node;
		const context = canvas.getContext("2d");
		//
		let outputScale = window.devicePixelRatio || 1;

		canvas.width = Math.floor(viewport.width * outputScale);
		canvas.height = Math.floor(viewport.height * outputScale);

		// canvas.style.width = Math.floor(viewport.width) + "px";
		// canvas.style.height = Math.floor(viewport.height) + "px";

		// const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;
		// canvas.height = viewport.height;
		// canvas.width = viewport.width;
		//
		const renderContext = {
			canvasContext: context!,
			viewport: viewport,
			transform: [3, 0, 0, 3, 0, 0],
		};

		page.render(renderContext);
		return true;
	}

	function loadPDF(
		node: HTMLCanvasElement,
		{ pageNumber = 1, scale = minScale }: { pageNumber?: number; scale?: number },
	) {
		if (isPageRendering) {
			return;
		}
		isPageRendering = true;
		asyncLoad(node, { pageNumber, scale })
			.catch(() => {
				toast.error("Error in loading pdf");
			})
			.finally(() => {
				isPageRendering = false;
			});
	}
</script>

<svelte:window
	on:resize={debounce(() => {
		if (!canvasElement) return;
		loadPDF(canvasElement, { scale });
	}, 500)}
/>

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
			<Root>
				<Trigger>
					<Button class="gap-1.5" aria-label="zoom" variant="ghost">
						<Search class="h-4 w-4" />
						<span>{(scale - 0.8) * 100}%</span>
						<ChevronDown class="h-3 w-3 opacity-50" />
					</Button>
				</Trigger>
				<Content>
					<Item>125%</Item>
				</Content>
			</Root>
		</div>
	</div>
	<div class="flex-1 w-full max-h-screen overflow-auto">
		{#if isPageRendering}
			<div class="flex justify-center">
				<Loader2 class="my-24 h-6 w-6 animate-spin" />
			</div>
		{/if}
		<canvas
			bind:this={canvasElement}
			class="h-full w-full bg-white"
			use:loadPDF={{ scale, pageNumber }}
		/>
	</div>
</div>
