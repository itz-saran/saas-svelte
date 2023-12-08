<script lang="ts">
	import type { PageData } from "./$types";
	import PDFRenderer from "$components/PDFRenderer.svelte";
	import ChatWrapper from "$components/ChatWrapper.svelte";
	export let data: PageData;
</script>

<div class="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
	<div class="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
		<!-- Left side -->
		<div class="flex-1 xl:flex">
			<div class="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
				<PDFRenderer />
			</div>
		</div>

		<!-- Chat -->
		<div class="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
			<ChatWrapper />
		</div>
	</div>
</div>
