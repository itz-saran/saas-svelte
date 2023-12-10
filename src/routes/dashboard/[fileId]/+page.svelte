<script lang="ts">
	import type { PageData } from "./$types";
	import PDFRenderer from "$components/PDFRenderer.svelte";
	import ChatWrapper from "$components/ChatWrapper.svelte";
	export let data: PageData;
</script>

<div class="flex-1 justify-between flex flex-col max-h-[calc(100vh-3.5rem)]">
	<div class="mx-auto h-full w-full max-w-8xl grow lg:flex xl:px-2">
		<!-- Left side  -->
		<div class="xl:flex lg:w-[60%]">
			<div class="w-full max-h-full px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
				<!-- PDF renderer -->
				<PDFRenderer url={data.file.url} name={data.file.name} />
			</div>
		</div>
		<!-- Chat -->
		<div class="shrink-0 lg:w-[40%] border-t border-gray-200 lg:border-l lg:border-t-0">
			<ChatWrapper />
		</div>
	</div>
</div>
