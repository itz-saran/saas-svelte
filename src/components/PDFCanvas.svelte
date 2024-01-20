<script lang="ts">
	import type { PDFDocumentProxy, PageViewport, PDFPageProxy } from "pdfjs-dist";
	import toast from "svelte-french-toast";
	import { Loader2 } from "lucide-svelte";
	import pdfjs from "$lib/pdfjs.lib";

	export let url: string;
	export let scale: number;
	export let pageNumber: number;
	export let rotation: number;
	export let minScale: number;
	export let maxScale: number;
	export let onPDFLoad: (pdf: PDFDocumentProxy | null) => void;
	export let multiple: boolean = false;

	let isLoading = true;
	let isPageRendering: boolean = false;
	let _totalPages: number | null = null;
	let pdfDoc: PDFDocumentProxy | null = null;

	let canvasElement: HTMLCanvasElement | null;
	// ? for multiple mode
	let canvasArray: HTMLCanvasElement[] = [];

	// Get the document load function ready
	const loadingTask = pdfjs.getDocument(url).promise;

	// PDF will be loaded again if page number or rotation is changed
	$: if (typeof rotation === "number" && canvasElement && pageNumber) {
		loadPDF(canvasElement, { pageNumber, scale, rotation, multiple });
	}

	function debounce(this: any, func: any, timeout = 300) {
		let timer: NodeJS.Timeout;
		return (...args: any) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				func.apply(this, args);
			}, timeout);
		};
	}

	type LoadOptions = { pageNumber?: number; scale?: number; rotation?: number; multiple: boolean };

	function render(
		node: HTMLCanvasElement,
		page: PDFPageProxy,
		viewport: PageViewport,
		outputScale: number,
	) {
		const canvas = node;
		const context = canvas.getContext("2d");

		canvas.width = Math.floor(viewport.width * outputScale);
		canvas.height = Math.floor(viewport.height * outputScale);
		canvas.style.width = Math.floor(viewport.width * outputScale) + "px";
		canvas.style.height = Math.floor(viewport.height * outputScale) + "px";

		const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

		const renderContext = {
			canvasContext: context!,
			transform: transform || undefined,
			viewport: viewport,
		};

		page.render(renderContext);
	}

	async function asyncLoad(
		node: HTMLCanvasElement,
		{ pageNumber, scale, rotation, multiple }: Required<LoadOptions>,
	) {
		// Support HiDPI-screens.
		const outputScale = window.devicePixelRatio || 1;

		// Resolve document from loadingTask
		pdfDoc = await loadingTask;
		_totalPages = pdfDoc.numPages;

		if (multiple && _totalPages) {
			for (let i = 1; i <= _totalPages; i++) {
				const page = await pdfDoc.getPage(pageNumber);
				const viewport = page.getViewport({
					scale: scale <= maxScale ? scale : maxScale,
					rotation,
				});

				render(canvasArray[i - 1], page, viewport, outputScale);
			}
		} else {
			const page = await pdfDoc.getPage(pageNumber);
			const viewport = page.getViewport({
				scale: scale <= maxScale ? scale : maxScale,
				rotation,
			});

			render(node, page, viewport, outputScale);
		}
		return pdfDoc;
	}

	function loadPDF(
		node: HTMLCanvasElement,
		{ pageNumber = 1, scale = minScale, rotation = 0, multiple = false }: LoadOptions,
	) {
		isLoading = true;
		if (isPageRendering) {
			return;
		}
		isPageRendering = true;
		asyncLoad(node, { pageNumber, scale, rotation, multiple })
			.then((pdf) => onPDFLoad(pdf))
			.catch(() => {
				onPDFLoad(null);
				toast.error("Error in loading pdf");
			})
			.finally(() => {
				isLoading = false;
				isPageRendering = false;
			});
	}
</script>

<svelte:window
	on:resize={debounce(() => {
		if (!canvasElement) return;
		loadPDF(canvasElement, { scale, pageNumber, rotation, multiple });
	}, 500)}
/>

{#if multiple && _totalPages}
	{#each Array(_totalPages) as _, i}
		<canvas bind:this={canvasArray[i]} class="bg-white overflow-auto" />
	{/each}
{:else}
	{#if isPageRendering || isLoading}
		<Loader2 class="my-24 h-6 w-6 animate-spin absolute" />
	{/if}
	<canvas
		bind:this={canvasElement}
		class="bg-white overflow-auto"
		use:loadPDF={{ scale, pageNumber, rotation, multiple }}
	/>
{/if}
